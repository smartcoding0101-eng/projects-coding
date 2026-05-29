<x-filament-panels::page>
    <x-filament::section collapsible collapsed heading="Seleccionar Socio" icon="heroicon-o-user">
        <form wire:submit="filter">
            {{ $this->filterForm }}
            <div class="mt-4 flex items-center justify-end gap-3">
                <x-filament::button type="submit" icon="heroicon-o-magnifying-glass"
                    size="sm">Consultar</x-filament::button>
            </div>
        </form>
    </x-filament::section>

    @php $data = $this->getData(); @endphp

    @if($data['socio'])
        {{-- Widgets managed by Page class getHeaderWidgets() --}}


        {{-- Info Socio Detallada --}}
        <x-filament::section icon="heroicon-o-user-circle">
            <x-slot name="heading">{{ $data['socio']['nombre'] }}</x-slot>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="flex items-center gap-2">
                    <span class="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">CI:</span>
                    <span class="font-mono font-semibold text-gray-950 dark:text-white">{{ $data['socio']['ci'] }}</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Grado:</span>
                    <span class="font-semibold text-gray-950 dark:text-white">{{ $data['socio']['grado'] }}</span>
                </div>
            </div>
        </x-filament::section>

        {{-- Créditos --}}
        <x-filament::section>
            <x-slot name="heading">
                <div class="flex items-center gap-2">Créditos <x-filament::badge color="warning"
                        size="sm">{{ count($data['creditos']) }}</x-filament::badge></div>
            </x-slot>
            <div
                class="overflow-x-auto rounded-xl ring-1 ring-gray-950/5 dark:ring-white/10 bg-white dark:bg-gray-900 shadow-sm">
                <table class="fi-ta-table w-full table-auto text-sm">
                    <thead class="bg-transparent border-b border-gray-200 dark:border-white/10">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Tipo</th>
                            <th class="px-4 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300">Monto</th>
                            <th class="px-4 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300">Saldo</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300">Estado
                            </th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300">Plazo
                            </th>
                            <div class="overflow-x-auto">
                                <table class="fi-ta-table w-full table-auto text-sm">
                                    <thead class="border-b border-gray-200 dark:border-white/10">
                                        <tr>
                                            <th class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                                                Tipo</th>
                                            <th class="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">
                                                Monto</th>
                                            <th class="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">
                                                Saldo</th>
                                            <th class="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">
                                                Estado</th>
                                            <th class="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">
                                                Plazo</th>
                                            <th class="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">
                                                Pagadas</th>
                                            <th class="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">
                                                Pendientes</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-200 dark:divide-white/5">
                                        @foreach($data['creditos'] as $i => $c)
                                            <tr class="border-b border-gray-100 dark:border-white/5 last:border-0">
                                                <td class="px-4 py-3 font-medium text-gray-950 dark:text-white">{{ $c['tipo'] }}
                                                </td>
                                                <td class="px-4 py-3 text-right font-mono text-gray-700 dark:text-gray-300">Bs
                                                    {{ number_format($c['monto_aprobado'], 2) }}
                                                </td>
                                                <td
                                                    class="px-4 py-3 text-right font-mono font-semibold text-gray-950 dark:text-white">
                                                    Bs
                                                    {{ number_format($c['saldo_capital'], 2) }}
                                                </td>
                                                <td class="px-4 py-3 text-center">
                                                    <x-filament::badge size="sm" :color="match ($c['estado']) { 'Desembolsado' => 'success', 'En Mora' => 'danger', 'Pagado' => 'gray', default => 'warning'}">{{ $c['estado'] }}</x-filament::badge>
                                                </td>
                                                <td class="px-4 py-3 text-center text-gray-600 dark:text-gray-400">
                                                    {{ $c['plazo'] }}m
                                                </td>
                                                <td class="px-4 py-3 text-center"><span
                                                        class="inline-flex items-center rounded-full bg-success-50 dark:bg-success-400/10 px-2 py-0.5 text-xs font-medium text-success-700 dark:text-success-400">{{ $c['cuotas_pagadas'] }}</span>
                                                </td>
                                                <td class="px-4 py-3 text-center"><span
                                                        class="inline-flex items-center rounded-full bg-warning-50 dark:bg-warning-400/10 px-2 py-0.5 text-xs font-medium text-warning-700 dark:text-warning-400">{{ $c['cuotas_pendientes'] }}</span>
                                                </td>
                                            </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
        </x-filament::section>

        {{-- Movimientos Kardex --}}
        <x-filament::section>
            <x-slot name="heading">
                <div class="flex items-center gap-2">Movimientos Kardex <x-filament::badge color="info"
                        size="sm">{{ count($data['movimientos']) }}</x-filament::badge></div>
            </x-slot>
            <div class="overflow-x-auto">
                <table class="fi-ta-table w-full table-auto text-sm">
                    <thead class="border-b border-gray-200 dark:border-white/10">
                        <tr>
                            <th class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Fecha</th>
                            <th class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Tipo</th>
                            <th class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Concepto</th>
                            <th class="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">Ingreso</th>
                            <th class="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">Egreso</th>
                            <th class="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">Saldo</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-white/5">
                        @forelse($data['movimientos'] as $i => $m)
                            <tr class="border-b border-gray-100 dark:border-white/5 last:border-0">
                                <td class="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">{{ $m['fecha'] }}</td>
                                <td class="px-4 py-3"><x-filament::badge size="sm"
                                        color="info">{{ $m['tipo'] }}</x-filament::badge></td>
                                <td class="px-4 py-3 font-medium text-gray-950 dark:text-white">{{ $m['concepto'] }}</td>
                                <td
                                    class="px-4 py-3 text-right font-mono {{ $m['ingreso'] > 0 ? 'text-success-600 dark:text-success-400 font-semibold' : 'text-gray-400' }}">
                                    {{ $m['ingreso'] > 0 ? 'Bs ' . number_format($m['ingreso'], 2) : '—' }}
                                </td>
                                <td
                                    class="px-4 py-3 text-right font-mono {{ $m['egreso'] > 0 ? 'text-danger-600 dark:text-danger-400 font-semibold' : 'text-gray-400' }}">
                                    {{ $m['egreso'] > 0 ? 'Bs ' . number_format($m['egreso'], 2) : '—' }}
                                </td>
                                <td class="px-4 py-3 text-right font-mono font-bold text-gray-950 dark:text-white">Bs
                                    {{ number_format($m['saldo'], 2) }}
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="6" class="px-4 py-12 text-center text-gray-500">No hay movimientos registrados.
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                    <tfoot class="bg-transparent border-t border-gray-200 dark:border-white/10">
                        <tr>
                            <td colspan="3" class="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">TOTALES
                            </td>
                            <td class="px-4 py-3 text-right font-mono text-sm font-medium text-gray-950 dark:text-white">
                                Bs {{ number_format(collect($data['movimientos'])->sum('ingreso'), 2) }}</td>
                            <td class="px-4 py-3 text-right font-mono text-sm font-medium text-gray-950 dark:text-white">
                                Bs {{ number_format(collect($data['movimientos'])->sum('egreso'), 2) }}</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </x-filament::section>
    @else
        <x-filament::section>
            <div class="py-12 text-center">
                <div class="flex flex-col items-center gap-3">
                    <div style="width: 3rem; height: 3rem;" class="mx-auto text-gray-400">
                        <x-heroicon-o-user style="width: 100%; height: 100%;" />
                    </div>
                    <p class="text-base font-medium text-gray-700 dark:text-gray-300 mb-1">Consulte el estado de cuenta</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Utilice el filtro superior para buscar por nombre o
                        CI</p>
                </div>
            </div>
        </x-filament::section>
    @endif
</x-filament-panels::page>