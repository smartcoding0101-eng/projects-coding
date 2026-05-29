<x-filament-panels::page>
    <x-filament::section collapsible collapsed heading="Filtros de Búsqueda" icon="heroicon-o-funnel">
        <form wire:submit="filter">
            {{ $this->filterForm }}
            <div class="mt-4 flex items-center justify-end gap-3">
                <x-filament::button type="submit" icon="heroicon-o-funnel" size="sm">Aplicar
                    Filtros</x-filament::button>
            </div>
        </form>
    </x-filament::section>

    @php $data = $this->getData(); @endphp

    {{-- Widgets managed by Page class getHeaderWidgets() --}}


    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {{-- Top Productos --}}
        <x-filament::section>
            <x-slot name="heading">
                <div class="flex items-center gap-2">
                    Top Productos
                    <x-filament::badge color="warning" size="sm">{{ count($data['top_productos']) }}</x-filament::badge>
                </div>
            </x-slot>
            <div class="overflow-x-auto rounded-xl ring-1 ring-gray-950/5 dark:ring-white/10 bg-white dark:bg-gray-900 shadow-sm">
                <table class="w-full table-fixed text-sm" style="table-layout: fixed;">
                    <thead class="bg-transparent border-b border-gray-200 dark:border-white/10">
                        <tr>
                            <th style="text-align: center; width: 25%;" class="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">#</th>
                            <th style="text-align: center; width: 25%;" class="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Producto</th>
                            <th style="text-align: center; width: 25%;" class="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Vendidos</th>
                            <th style="text-align: center; width: 25%;" class="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Recaudado</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-white/5">
                        @forelse($data['top_productos'] as $i => $p)
                            <tr class="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <td style="text-align: center;" class="px-4 py-3">
                                    <span
                                        class="inline-flex h-6 w-6 items-center justify-center rounded-full {{ $i < 3 ? 'bg-warning-100 text-warning-700 dark:bg-warning-400/20 dark:text-warning-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' }} text-xs font-bold">{{ $i + 1 }}</span>
                                </td>
                                <td style="text-align: center;" class="px-4 py-3 font-medium text-gray-950 dark:text-white">{{ $p->nombre }}</td>
                                <td style="text-align: center;" class="px-4 py-3 font-mono text-gray-700 dark:text-gray-300">{{ $p->total_vendido }}</td>
                                <td style="text-align: center;" class="px-4 py-3 font-mono font-semibold text-success-600 dark:text-success-400">Bs {{ number_format($p->recaudado, 2) }}</td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="4" style="text-align: center;" class="px-4 py-8 text-gray-500 dark:text-gray-400">Sin datos.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </x-filament::section>

        {{-- Ventas por Tipo --}}
        <x-filament::section heading="Ventas por Tipo de Pago">
            <div class="space-y-3">
                @forelse($data['ventas_por_tipo'] as $v)
                    @php $max = collect($data['ventas_por_tipo'])->max('total');
                    $pct = $max > 0 ? ($v->total / $max) * 100 : 0; @endphp
                    <div>
                        <div class="flex items-center justify-between mb-1">
                            <span
                                class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ ucfirst($v->tipo_pago ?? 'N/D') }}</span>
                            <span class="text-sm font-mono font-bold text-gray-950 dark:text-white">Bs
                                {{ number_format($v->total, 2) }}</span>
                        </div>
                        <div class="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
                            <div class="bg-primary-500 h-2.5 rounded-full transition-all duration-500"
                                style="width: {{ $pct }}%"></div>
                        </div>
                    </div>
                @empty
                    <p class="text-sm text-gray-500 dark:text-gray-400 !text-center py-4">Sin datos.</p>
                @endforelse
            </div>
        </x-filament::section>
    </div>

    {{-- Transacciones Recientes --}}
    <x-filament::section>
        <x-slot name="heading">
            <div class="flex items-center gap-2">
                Transacciones Recientes
                <x-filament::badge color="info" size="sm">{{ count($data['recientes']) }}</x-filament::badge>
            </div>
        </x-slot>

        <div class="overflow-x-auto rounded-xl ring-1 ring-gray-950/5 dark:ring-white/10 bg-white dark:bg-gray-900 shadow-sm">
            <table class="w-full table-fixed text-sm" style="table-layout: fixed;">
                <thead class="bg-transparent border-b border-gray-200 dark:border-white/10">
                    <tr>
                        <th style="text-align: center; width: 12%;" class="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Orden</th>
                        <th style="text-align: center; width: 22%;" class="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Cliente</th>
                        <th style="text-align: center; width: 12%;" class="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Método</th>
                        <th style="text-align: center; width: 12%;" class="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Estado</th>
                        <th style="text-align: center; width: 18%;" class="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Total</th>
                        <th style="text-align: center; width: 24%;" class="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Fecha</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-white/5">
                    @forelse($data['recientes'] as $i => $p)
                        <tr class="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td style="text-align: center;" class="px-4 py-3 font-medium font-mono text-gray-950 dark:text-white">{{ $p['orden'] }}</td>
                            <td style="text-align: center;" class="px-4 py-3 text-gray-700 dark:text-gray-300">{{ $p['cliente'] }}</td>
                            <td style="text-align: center;" class="px-4 py-3"><x-filament::badge size="sm"
                                    color="info">{{ $p['metodo'] }}</x-filament::badge></td>
                            <td style="text-align: center;" class="px-4 py-3">
                                <x-filament::badge size="sm" :color="match ($p['estado']) { 'pagado' => 'success', 'rechazado' => 'danger', default => 'warning'}">
                                    {{ ucfirst($p['estado']) }}
                                </x-filament::badge>
                            </td>
                            <td style="text-align: center;" class="px-4 py-3 font-mono font-semibold text-gray-950 dark:text-white">Bs {{ number_format($p['total'], 2) }}</td>
                            <td style="text-align: center;" class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ $p['fecha'] }}</td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" style="text-align: center;" class="px-4 py-12 text-gray-500">
                                <div style="width: 3rem; height: 3rem;" class="mx-auto text-gray-400 mb-2">
                                    <x-heroicon-o-shopping-cart style="width: 100%; height: 100%;" />
                                </div>
                                Sin transacciones recientes.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </x-filament::section>
</x-filament-panels::page>