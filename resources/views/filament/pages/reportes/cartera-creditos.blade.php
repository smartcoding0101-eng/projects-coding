<x-filament-panels::page>
    {{-- Filtros --}}
    <x-filament::section collapsible collapsed heading="Filtros de Búsqueda" icon="heroicon-o-funnel">
        <form wire:submit="filter">
            {{ $this->filterForm }}
            <div class="mt-4 flex items-center justify-end gap-3">
                <x-filament::button type="submit" icon="heroicon-o-funnel" size="sm">
                    Aplicar Filtros
                </x-filament::button>
            </div>
        </form>
    </x-filament::section>

    {{-- Widgets managed by Page class getHeaderWidgets() --}}

    {{-- Tabla de datos --}}

    @php $data = $this->getData(); @endphp
    <x-filament::section>
        <x-slot name="heading">
            <div class="flex items-center gap-2">
                Detalle de Créditos
                <x-filament::badge color="primary" size="sm">
                    {{ count($data['creditos']) }} registros
                </x-filament::badge>
            </div>
        </x-slot>
        <x-slot name="description">Generado: {{ $data['fecha_generacion'] }}</x-slot>

        <div
            class="overflow-x-auto rounded-xl ring-1 ring-gray-950/5 dark:ring-white/10 bg-white dark:bg-gray-900 shadow-sm">
            <table class="fi-ta-table w-full table-auto text-sm">
                <thead class="bg-transparent border-b border-gray-200 dark:border-white/10">
                    <tr>
                        <th
                            class="fi-ta-header-cell px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">
                            Socio</th>
                        <th
                            class="fi-ta-header-cell px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">
                            CI</th>
                        <th
                            class="fi-ta-header-cell px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">
                            Tipo</th>
                        <th
                            class="fi-ta-header-cell px-4 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300">
                            Monto Aprobado</th>
                        <th
                            class="fi-ta-header-cell px-4 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300">
                            Saldo Capital</th>
                        <th
                            class="fi-ta-header-cell px-4 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300">
                            Tasa</th>
                        <th
                            class="fi-ta-header-cell px-4 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300">
                            Plazo</th>
                        <th
                            class="fi-ta-header-cell px-4 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300">
                            Estado</th>
                        <th
                            class="fi-ta-header-cell px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">
                            Desembolso</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-white/5">
                    @forelse($data['creditos'] as $i => $c)
                        <tr
                            class="bg-transparent transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-100 dark:border-white/5 last:border-0">
                            <td class="fi-ta-cell px-4 py-3 font-medium text-gray-950 dark:text-white">{{ $c['socio'] }}
                            </td>
                            <td class="fi-ta-cell px-4 py-3 text-gray-600 dark:text-gray-400">{{ $c['ci'] }}</td>
                            <td class="fi-ta-cell px-4 py-3 text-gray-600 dark:text-gray-400">{{ $c['tipo'] }}</td>
                            <td class="fi-ta-cell px-4 py-3 text-right font-mono text-gray-700 dark:text-gray-300">Bs
                                {{ number_format($c['monto_aprobado'], 2) }}
                            </td>
                            <td
                                class="fi-ta-cell px-4 py-3 text-right font-mono font-semibold text-gray-950 dark:text-white">
                                Bs {{ number_format($c['saldo_capital'], 2) }}</td>
                            <td class="fi-ta-cell px-4 py-3 text-center text-gray-600 dark:text-gray-400">{{ $c['tasa'] }}%
                            </td>
                            <td class="fi-ta-cell px-4 py-3 text-center text-gray-600 dark:text-gray-400">{{ $c['plazo'] }}m
                            </td>
                            <td class="fi-ta-cell px-4 py-3 text-center">
                                <x-filament::badge size="sm" :color="match ($c['estado']) { 'Desembolsado' => 'success', 'En Mora' => 'danger', 'Pagado' => 'gray', default => 'warning'}">
                                    {{ $c['estado'] }}
                                </x-filament::badge>
                            </td>
                            <td class="fi-ta-cell px-4 py-3 text-gray-600 dark:text-gray-400">{{ $c['fecha_desembolso'] }}
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="9" class="px-4 py-12 text-center">
                                <div class="flex flex-col items-center gap-2">
                                    <div style="width: 3rem; height: 3rem;" class="mx-auto text-gray-400 mb-2">
                                        <x-heroicon-o-document-magnifying-glass style="width: 100%; height: 100%;" />
                                    </div>
                                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">No hay créditos con los
                                        filtros aplicados</p>
                                    <p class="text-xs text-gray-400 dark:text-gray-500">Intente ajustar los filtros de
                                        búsqueda</p>
                                </div>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
                @if(count($data['creditos']) > 0)
                    <tfoot class="bg-transparent border-t border-gray-200 dark:border-white/10">
                        <tr>
                            <td colspan="3" class="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">TOTALES
                            </td>
                            <td class="px-4 py-3 text-right font-mono text-sm font-medium text-gray-950 dark:text-white">Bs
                                {{ number_format(collect($data['creditos'])->sum('monto_aprobado'), 2) }}
                            </td>
                            <td class="px-4 py-3 text-right font-mono text-sm font-medium text-gray-950 dark:text-white">Bs
                                {{ number_format(collect($data['creditos'])->sum('saldo_capital'), 2) }}
                            </td>
                            <td colspan="4"></td>
                        </tr>
                    </tfoot>
                @endif
            </table>
        </div>
    </x-filament::section>
</x-filament-panels::page>