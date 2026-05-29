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

    {{-- Tabla de Cuotas en Mora --}}

    <x-filament::section>
        <x-slot name="heading">
            <div class="flex items-center gap-2">
                Cuotas en Mora
                <x-filament::badge color="danger" size="sm">
                    {{ count($data['cuotas']) }} cuotas
                </x-filament::badge>
            </div>
        </x-slot>

        <div class="overflow-x-auto rounded-xl ring-1 ring-gray-950/5 dark:ring-white/10 bg-white dark:bg-gray-900 shadow-sm">
            <table class="fi-ta-table w-full table-auto text-sm">
                <thead class="bg-transparent border-b border-gray-200 dark:border-white/10">
                    <tr>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Socio</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">CI</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Tipo Crédito</th>
                        <th class="px-4 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300">Cuota</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Vencimiento</th>
                        <th class="px-4 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300">Días Mora</th>
                        <th class="px-4 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300">Capital</th>
                        <th class="px-4 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300">Interés</th>
                        <th class="px-4 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300">Mora</th>
                        <th class="px-4 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300">Total</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-white/5">
                    @forelse($data['cuotas'] as $i => $c)
                        <tr class="bg-transparent transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-100 dark:border-white/5 last:border-0">
                            <td class="px-4 py-3 font-medium text-gray-950 dark:text-white">{{ $c['socio'] }}</td>
                            <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ $c['ci'] }}</td>
                            <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ $c['tipo_credito'] }}</td>
                            <td class="px-4 py-3 text-center">
                                <span
                                    class="inline-flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300">#{{ $c['nro_cuota'] }}</span>
                            </td>
                            <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ $c['fecha_vencimiento'] }}</td>
                            <td class="px-4 py-3 text-center">
                                <x-filament::badge size="sm" :color="$c['dias_mora'] > 60 ? 'danger' : ($c['dias_mora'] > 30 ? 'warning' : 'gray')">
                                    {{ $c['dias_mora'] }} días
                                </x-filament::badge>
                            </td>
                            <td class="px-4 py-3 text-right font-mono text-gray-700 dark:text-gray-300">Bs
                                {{ number_format($c['capital'], 2) }}</td>
                            <td class="px-4 py-3 text-right font-mono text-gray-600 dark:text-gray-400">Bs
                                {{ number_format($c['interes'], 2) }}</td>
                            <td class="px-4 py-3 text-right font-mono text-danger-600 dark:text-danger-400">Bs
                                {{ number_format($c['mora'], 2) }}</td>
                            <td class="px-4 py-3 text-right font-mono font-bold text-gray-950 dark:text-white">Bs
                                {{ number_format($c['total'], 2) }}</td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="10" class="px-4 py-12 text-center">
                                <div class="flex flex-col items-center gap-2">
                                    <div style="width: 3rem; height: 3rem;" class="mx-auto text-gray-400 mb-2">
                                        <x-heroicon-o-check-circle style="width: 100%; height: 100%;" />
                                    </div>
                                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">No hay cuotas en mora</p>
                                    <p class="text-xs text-gray-400 dark:text-gray-500">Todos los pagos están al día</p>
                                </div>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
                @if(count($data['cuotas']) > 0)
                    <tfoot class="bg-transparent border-t border-gray-200 dark:border-white/10">
                        <tr>
                            <td colspan="6" class="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">TOTALES
                            </td>
                            <td class="px-4 py-3 text-right font-mono text-sm font-medium text-gray-950 dark:text-white">Bs
                                {{ number_format(collect($data['cuotas'])->sum('capital'), 2) }}</td>
                            <td class="px-4 py-3 text-right font-mono text-sm font-medium text-gray-700 dark:text-gray-300">Bs
                                {{ number_format(collect($data['cuotas'])->sum('interes'), 2) }}</td>
                            <td class="px-4 py-3 text-right font-mono text-sm font-medium text-gray-950 dark:text-white">Bs
                                {{ number_format(collect($data['cuotas'])->sum('mora'), 2) }}</td>
                            <td class="px-4 py-3 text-right font-mono text-sm font-medium text-gray-950 dark:text-white">Bs
                                {{ number_format(collect($data['cuotas'])->sum('total'), 2) }}</td>
                        </tr>
                    </tfoot>
                @endif
            </table>
        </div>
    </x-filament::section>
</x-filament-panels::page>