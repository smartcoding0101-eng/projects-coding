<x-filament-panels::page>
    {{-- Filtros --}}
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


    {{-- Recaudación --}}
    <x-filament::section>
        <x-slot name="heading">
            <div class="flex items-center gap-2">
                Detalle de Recaudación
                <x-filament::badge color="success" size="sm">{{ count($data['detalle_pagos']) }}
                    pagos</x-filament::badge>
            </div>
        </x-slot>

        <div
            class="overflow-x-auto rounded-xl ring-1 ring-gray-950/5 dark:ring-white/10 bg-white dark:bg-gray-900 shadow-sm">
            <table class="fi-ta-table w-full table-auto text-sm">
                <thead class="bg-transparent border-b border-gray-200 dark:border-white/10">
                    <tr>
                        <th class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Fecha</th>
                        <th class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Socio</th>
                        <th class="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">Crédito</th>
                        <th class="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">Cuota</th>
                        <th class="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">Total</th>
                        <th class="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">Capital</th>
                        <th class="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">Interés</th>
                        <th class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Método</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-white/5">
                    @forelse($data['detalle_pagos'] as $i => $p)
                        <tr
                            class="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ $p['fecha'] }}</td>
                            <td class="px-4 py-3 font-medium text-gray-950 dark:text-white">{{ $p['socio'] }}</td>
                            <td class="px-4 py-3 text-center"><span
                                    class="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300">#{{ $p['credito_id'] }}</span>
                            </td>
                            <td class="px-4 py-3 text-center"><span
                                    class="inline-flex items-center rounded-full bg-primary-50 dark:bg-primary-400/10 px-2 py-0.5 text-xs font-medium text-primary-700 dark:text-primary-300">#{{ $p['cuota'] }}</span>
                            </td>
                            <td class="px-4 py-3 text-right font-mono font-bold text-success-600 dark:text-success-400">Bs
                                {{ number_format($p['total'], 2) }}
                            </td>
                            <td class="px-4 py-3 text-right font-mono text-gray-700 dark:text-gray-300">Bs
                                {{ number_format($p['capital'], 2) }}
                            </td>
                            <td class="px-4 py-3 text-right font-mono text-gray-600 dark:text-gray-400">Bs
                                {{ number_format($p['interes'], 2) }}
                            </td>
                            <td class="px-4 py-3"><x-filament::badge size="sm"
                                    color="info">{{ $p['metodo'] }}</x-filament::badge></td>
                        </tr>
                    @empty
                        <td colspan="8" class="px-4 py-12 text-center text-gray-500">
                            <div style="width: 3rem; height: 3rem;" class="mx-auto text-gray-400 mb-2">
                                <x-heroicon-o-banknotes style="width: 100%; height: 100%;" />
                            </div>
                            No hay pagos en el periodo.
                        </td>
                    @endforelse
                </tbody>
                @if(count($data['detalle_pagos']) > 0)
                    <tfoot class="border-t border-gray-200 dark:border-white/10 bg-transparent">
                        <tr>
                            <td colspan="4" class="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">TOTALES
                            </td>
                            <td class="px-4 py-3 text-right font-mono font-medium text-gray-950 dark:text-white">Bs
                                {{ number_format(collect($data['detalle_pagos'])->sum('total'), 2) }}
                            </td>
                            <td class="px-4 py-3 text-right font-mono font-medium text-gray-950 dark:text-white">Bs
                                {{ number_format(collect($data['detalle_pagos'])->sum('capital'), 2) }}
                            </td>
                            <td class="px-4 py-3 text-right font-mono font-medium text-gray-950 dark:text-white">Bs
                                {{ number_format(collect($data['detalle_pagos'])->sum('interes'), 2) }}
                            </td>
                            <td></td>
                        </tr>
                    </tfoot>
                @endif
            </table>
        </div>
    </x-filament::section>

    {{-- Colocaciones --}}
    <x-filament::section>
        <x-slot name="heading">
            <div class="flex items-center gap-2">
                Detalle de Colocación
                <x-filament::badge color="primary" size="sm">{{ count($data['detalle_colocaciones']) }}
                    créditos</x-filament::badge>
            </div>
        </x-slot>

        <div
            class="overflow-x-auto rounded-xl ring-1 ring-gray-950/5 dark:ring-white/10 bg-white dark:bg-gray-900 shadow-sm">
            <table class="fi-ta-table w-full table-auto text-sm">
                <thead class="bg-transparent border-b border-gray-200 dark:border-white/10">
                    <tr>
                        <th class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Fecha</th>
                        <th class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Socio</th>
                        <th class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Tipo</th>
                        <th class="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">Monto</th>
                        <th class="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">Tasa</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-white/5">
                    @forelse($data['detalle_colocaciones'] as $i => $c)
                        <tr
                            class="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ $c['fecha'] }}</td>
                            <td class="px-4 py-3 font-medium text-gray-950 dark:text-white">{{ $c['socio'] }}</td>
                            <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ $c['tipo'] }}</td>
                            <td class="px-4 py-3 text-right font-mono font-bold text-primary-600 dark:text-primary-400">Bs
                                {{ number_format($c['monto'], 2) }}
                            </td>
                            <td class="px-4 py-3 text-center text-gray-600 dark:text-gray-400">{{ $c['tasa'] }}</td>
                        </tr>
                    @empty
                        <td colspan="5" class="px-4 py-12 text-center text-gray-500">
                            <div style="width: 3rem; height: 3rem;" class="mx-auto text-gray-400 mb-2">
                                <x-heroicon-o-document-text style="width: 100%; height: 100%;" />
                            </div>
                            No hay colocaciones en el periodo.
                        </td>
                    @endforelse
                </tbody>
                @if(count($data['detalle_colocaciones']) > 0)
                    <tfoot class="border-t border-gray-200 dark:border-white/10 bg-transparent">
                        <tr>
                            <td colspan="3" class="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">TOTAL
                                COLOCADO</td>
                            <td class="px-4 py-3 text-right font-mono font-medium text-gray-950 dark:text-white">Bs
                                {{ number_format(collect($data['detalle_colocaciones'])->sum('monto'), 2) }}
                            </td>
                            <td></td>
                        </tr>
                    </tfoot>
                @endif
            </table>
        </div>
    </x-filament::section>
</x-filament-panels::page>