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
                Conciliación E-Commerce
                <x-filament::badge color="info" size="sm">{{ count($data['registros'] ?? []) }}
                    registros</x-filament::badge>
            </div>
        </x-slot>

        <div class="overflow-x-auto rounded-xl ring-1 ring-gray-950/5 dark:ring-white/10 bg-white dark:bg-gray-900 shadow-sm">
            <table class="fi-ta-table w-full table-auto text-sm">
                <thead class="bg-transparent border-b border-gray-200 dark:border-white/10">
                    <tr>
                        <th class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Fecha</th>
                        <th class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Orden</th>
                        <th class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Cliente</th>
                        <th class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Método</th>
                        <th class="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">Estado Pago</th>
                        <th class="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">Estado Pedido</th>
                        <th class="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">Total</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-white/5">
                    @forelse($data['registros'] ?? [] as $i => $r)
                        <tr class="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td class="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">{{ $r['fecha'] }}</td>
                            <td class="px-4 py-3 font-mono font-medium text-gray-950 dark:text-white">{{ $r['orden'] }}</td>
                            <td class="px-4 py-3 text-gray-700 dark:text-gray-300">{{ $r['cliente'] }}</td>
                            <td class="px-4 py-3"><x-filament::badge size="sm"
                                    color="info">{{ $r['metodo'] }}</x-filament::badge></td>
                            <td class="px-4 py-3 text-center">
                                <x-filament::badge size="sm" :color="match ($r['estado_pago'] ?? '') { 'pagado' => 'success', 'pendiente' => 'warning', default => 'gray'}">
                                    {{ ucfirst($r['estado_pago'] ?? 'N/D') }}
                                </x-filament::badge>
                            </td>
                            <td class="px-4 py-3 text-center">
                                <x-filament::badge size="sm" :color="match ($r['estado_pedido'] ?? '') { 'entregado' => 'success', 'procesando' => 'warning', 'cancelado' => 'danger', default => 'gray'}">
                                    {{ ucfirst($r['estado_pedido'] ?? 'N/D') }}
                                </x-filament::badge>
                            </td>
                            <td class="px-4 py-3 text-right font-mono font-semibold text-gray-950 dark:text-white">Bs
                                {{ number_format($r['total'], 2) }}</td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="px-4 py-12 text-center text-gray-500">
                                <div style="width: 3rem; height: 3rem;" class="mx-auto text-gray-400 mb-2">
                                    <x-heroicon-o-scale style="width: 100%; height: 100%;" />
                                </div>
                                Sin registros de conciliación.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
                @if(count($data['registros'] ?? []) > 0)
                    <tfoot class="border-t border-gray-200 dark:border-white/10 bg-transparent">
                        <tr>
                            <td colspan="6" class="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">TOTAL</td>
                            <td class="px-4 py-3 text-right font-mono font-medium text-gray-950 dark:text-white">Bs
                                {{ number_format(collect($data['registros'] ?? [])->sum('total'), 2) }}</td>
                        </tr>
                    </tfoot>
                @endif
            </table>
        </div>
    </x-filament::section>
</x-filament-panels::page>