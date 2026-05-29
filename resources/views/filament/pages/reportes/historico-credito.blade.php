<x-filament-panels::page>
    <x-filament::section collapsible collapsed heading="Buscar Socio" icon="heroicon-o-magnifying-glass">
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


        {{-- Socio Info --}}
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

        {{-- Historial --}}
        <x-filament::section>
            <x-slot name="heading">
                <div class="flex items-center gap-2">Historial Crediticio <x-filament::badge color="primary"
                        size="sm">{{ count($data['historial']) }}</x-filament::badge></div>
            </x-slot>
            <div class="overflow-x-auto rounded-xl ring-1 ring-gray-950/5 dark:ring-white/10 bg-white dark:bg-gray-900 shadow-sm">
                <table class="fi-ta-table w-full table-auto text-sm">
                    <thead class="bg-transparent border-b border-gray-200 dark:border-white/10">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Tipo</th>
                            <th class="px-4 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300">Monto</th>
                            <th class="px-4 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300">Saldo</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300">Estado</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300">Cuotas</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300">Mora Máx</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Inicio</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-white/5">
                        @forelse($data['historial'] as $i => $h)
                            <tr class="bg-transparent transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-100 dark:border-white/5 last:border-0">
                                <td class="px-4 py-3 font-medium text-gray-950 dark:text-white">{{ $h['tipo'] }}</td>
                                <td class="px-4 py-3 text-right font-mono text-gray-700 dark:text-gray-300">Bs
                                    {{ number_format($h['monto'], 2) }}</td>
                                <td class="px-4 py-3 text-right font-mono font-semibold text-gray-950 dark:text-white">Bs
                                    {{ number_format($h['saldo'], 2) }}</td>
                                <td class="px-4 py-3 text-center">
                                    <x-filament::badge size="sm" :color="match ($h['estado']) { 'Desembolsado' => 'success', 'En Mora' => 'danger', 'Pagado' => 'gray', default => 'warning'}">{{ $h['estado'] }}</x-filament::badge>
                                </td>
                                <td class="px-4 py-3 text-center text-gray-600 dark:text-gray-400">
                                    {{ $h['cuotas_pagadas'] }}/{{ $h['cuotas_total'] }}</td>
                                <td class="px-4 py-3 text-center">
                                    @if($h['mora_max_dias'] > 0)
                                        <x-filament::badge size="sm" :color="$h['mora_max_dias'] > 30 ? 'danger' : 'warning'">{{ $h['mora_max_dias'] }}d</x-filament::badge>
                                    @else
                                        <span class="text-success-500 font-bold">✓</span>
                                    @endif
                                </td>
                                <td class="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                    {{ $h['fecha_inicio'] }}</td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="7" class="px-4 py-12 text-center">
                                    <div class="flex flex-col items-center gap-2">
                                        <div style="width: 2rem; height: 2rem;" class="text-gray-400">
                                            <x-heroicon-o-clock style="width: 100%; height: 100%;" />
                                        </div>
                                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Sin historial crediticio
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </x-filament::section>

        {{-- Historial de Pagos --}}
        <x-filament::section collapsible heading="Detalle de Pagos Históricos">
            <x-slot name="heading">
                <div class="flex items-center gap-2">Detalle de Pagos Históricos <x-filament::badge color="success"
                        size="sm">{{ count($data['historial_pagos']) }}</x-filament::badge></div>
            </x-slot>
            <div class="overflow-x-auto rounded-xl ring-1 ring-gray-950/5 dark:ring-white/10 bg-white dark:bg-gray-900 shadow-sm">
                <table class="fi-ta-table w-full table-auto text-sm">
                    <thead class="bg-transparent border-b border-gray-200 dark:border-white/10">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Crédito</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300">Cuota</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Vencimiento</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Pago</th>
                            <th class="px-4 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300">Mora</th>
                            <th class="px-4 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300">Total</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-white/5">
                        @foreach($data['historial_pagos'] as $i => $p)
                            <tr class="bg-transparent transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-100 dark:border-white/5 last:border-0">
                                <td class="px-4 py-3 font-medium text-gray-950 dark:text-white">{{ $p['credito'] }}</td>
                                <td class="px-4 py-3 text-center"><span
                                        class="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300">#{{ $p['cuota'] }}</span>
                                </td>
                                <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ $p['vencimiento'] }}</td>
                                <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ $p['fecha_pago'] ?? '—' }}</td>
                                <td
                                    class="px-4 py-3 text-right font-mono {{ $p['mora'] > 0 ? 'text-danger-600 dark:text-danger-400 font-bold' : 'text-gray-400' }}">
                                    Bs {{ number_format($p['mora'], 2) }}</td>
                                <td class="px-4 py-3 text-right font-mono font-bold text-gray-950 dark:text-white">Bs
                                    {{ number_format($p['total'], 2) }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </x-filament::section>
    @else
        <x-filament::section>
            <div class="py-12 text-center">
                <div class="flex flex-col items-center gap-3">
                    <div style="width: 3rem; height: 3rem;" class="mx-auto text-gray-400 mb-2">
                        <x-heroicon-o-user style="width: 100%; height: 100%;" />
                    </div>

                    <p class="text-base font-medium text-gray-700 dark:text-gray-300">Consulte el historial crediticio</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Ingrese el nombre o CI del socio en el filtro
                        superior</p>
                </div>
            </div>
        </x-filament::section>
    @endif
</x-filament-panels::page>