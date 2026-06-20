<?php

namespace App\Filament\Pages\Reportes\Widgets;

use App\Models\PlanPago;
use Carbon\Carbon;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class MorosidadStatsWidget extends StatsOverviewWidget
{
    public ?array $filtros = [];

    protected function getStats(): array
    {
        $minDias = $this->filtros['min_dias'] ?? null;
        $maxDias = $this->filtros['max_dias'] ?? null;
        $tipoId = $this->filtros['tipo_id'] ?? null;
        $search = $this->filtros['search'] ?? null;

        $query = PlanPago::where('plan_pagos.estado', PlanPago::ESTADO_RETRASADA)
            ->join('creditos', 'plan_pagos.credito_id', '=', 'creditos.id')
            ->join('users', 'creditos.user_id', '=', 'users.id')
            ->join('personas', 'users.persona_id', '=', 'personas.id')
            ->select('plan_pagos.*', 'creditos.tipo_credito_id', 'users.name', 'personas.ci');

        if ($tipoId) {
            $query->where('creditos.tipo_credito_id', $tipoId);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('users.name', 'like', "%{$search}%")
                    ->orWhere('personas.ci', 'like', "%{$search}%");
            });
        }

        $cuotasMora = $query->get();

        if ($minDias !== null || $maxDias !== null) {
            $cuotasMora = $cuotasMora->filter(function ($c) use ($minDias, $maxDias) {
                $dias = $c->fecha_vencimiento ? (int) \Carbon\Carbon::parse($c->fecha_vencimiento)->diffInDays(now(), false) : 0;
                if ($minDias !== null && $dias < $minDias)
                    return false;
                if ($maxDias !== null && $dias > $maxDias)
                    return false;
                return true;
            });
        }

        $sociosAfectados = $cuotasMora->pluck('credito_id')->unique()->count();

        // Trend: cuotas retrasadas por mes
        $trend = [];
        for ($i = 5; $i >= 0; $i--) {
            $trend[] = PlanPago::where('estado', PlanPago::ESTADO_RETRASADA)
                ->whereMonth('fecha_vencimiento', now()->subMonths($i)->month)
                ->whereYear('fecha_vencimiento', now()->subMonths($i)->year)
                ->count();
        }

        return [
            Stat::make('Cuotas Atrasadas', $cuotasMora->count())
                ->description('Total de cuotas vencidas')
                ->descriptionIcon('heroicon-o-exclamation-triangle')
                ->color('danger')
                ->chart($trend),

            Stat::make('Capital Moroso', 'Bs ' . number_format($cuotasMora->sum('capital_amortizado'), 2))
                ->description('Capital en riesgo')
                ->descriptionIcon('heroicon-o-arrow-trending-down')
                ->color('warning'),

            Stat::make('Mora Acumulada', 'Bs ' . number_format($cuotasMora->sum('monto_mora'), 2))
                ->description('Intereses moratorios')
                ->descriptionIcon('heroicon-o-currency-dollar')
                ->color('danger'),

            Stat::make('Socios Afectados', $sociosAfectados)
                ->description('Créditos con mora')
                ->descriptionIcon('heroicon-o-users')
                ->color('primary'),
        ];
    }
}
