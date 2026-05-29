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

    <x-filament::section>
        <x-slot name="heading">
            <div class="flex items-center gap-2">
                Movimientos E-Commerce
                <x-filament::badge color="primary" size="sm">{{ count($data['movimientos'] ?? []) }}
                    registros</x-filament::badge>
            </div>
        </x-slot>

        <div class="overflow-x-auto rounded-xl ring-1 ring-gray-950/5 dark:ring-white/10 bg-white dark:bg-gray-900 shadow-sm">
            <table class="fi-ta-table w-full table-auto text-sm">
                <thead class="bg-transparent border-b border-gray-200 dark:border-white/10">
                    <tr>
                        <th class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Fecha</th>
                        <th class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Tipo</th>
                        <th class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Referencia</th>
                        <th class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Concepto</th>
                        <th class="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">Ingreso</th>
                        <th class="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">Egreso</th>
                        <th class="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">Saldo</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-white/5">
                    @forelse($data['movimientos'] ?? [] as $i => $m)
                        <tr class="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td class="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">{{ $m['fecha'] }}</td>
                            <td class="px-4 py-3">
                                <x-filament::badge size="sm" :color="($m['tipo'] ?? '') === 'ingreso' ? 'success' : (($m['tipo'] ?? '') === 'egreso' ? 'danger' : 'gray')">
                                    {{ ucfirst($m['tipo'] ?? '') }}
                                </x-filament::badge>
                            </td>
                            <td class="px-4 py-3 font-mono text-gray-700 dark:text-gray-300">{{ $m['referencia'] ?? '' }}
                            </td>
                            <td class="px-4 py-3 font-medium text-gray-950 dark:text-white">{{ $m['concepto'] }}</td>
                            <td
                                class="px-4 py-3 text-right font-mono {{ ($m['ingreso'] ?? 0) > 0 ? 'text-success-600 dark:text-success-400 font-semibold' : 'text-gray-400' }}">
                                {{ ($m['ingreso'] ?? 0) > 0 ? 'Bs ' . number_format($m['ingreso'], 2) : '—' }}
                            </td>
                            <td
                                class="px-4 py-3 text-right font-mono {{ ($m['egreso'] ?? 0) > 0 ? 'text-danger-600 dark:text-danger-400 font-semibold' : 'text-gray-400' }}">
                                {{ ($m['egreso'] ?? 0) > 0 ? 'Bs ' . number_format($m['egreso'], 2) : '—' }}
                            </td>
                            <td class="px-4 py-3 text-right font-mono font-bold text-gray-950 dark:text-white">Bs
                                {{ number_format($m['saldo'] ?? 0, 2) }}</td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="px-4 py-12 text-center text-gray-500">
                                <div style="width: 3rem; height: 3rem;" class="mx-auto text-gray-400 mb-2">
                                    <x-heroicon-o-arrows-right-left style="width: 100%; height: 100%;" />
                                </div>
                                Sin movimientos en el periodo.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
                @if(count($data['movimientos'] ?? []) > 0)
                    <tfoot class="border-t border-gray-200 dark:border-white/10 bg-transparent">
                        <tr>
                            <td colspan="4" class="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">TOTALES
                            </td>
                            <td class="px-4 py-3 text-right font-mono font-medium text-gray-950 dark:text-white">Bs
                                {{ number_format(collect($data['movimientos'] ?? [])->sum('ingreso'), 2) }}</td>
                            <td class="px-4 py-3 text-right font-mono font-medium text-gray-950 dark:text-white">Bs
                                {{ number_format(collect($data['movimientos'] ?? [])->sum('egreso'), 2) }}</td>
                            <td class="px-4 py-3 text-right font-mono font-medium text-gray-950 dark:text-white">Bs
                                {{ number_format(collect($data['movimientos'] ?? [])->last()['saldo'] ?? 0, 2) }}</td>
                        </tr>
                    </tfoot>
                @endif
            </table>
        </div>
    </x-filament::section>
</x-filament-panels::page>