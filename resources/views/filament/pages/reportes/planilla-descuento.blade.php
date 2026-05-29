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
                Planilla de Descuento
                <x-filament::badge color="primary" size="sm">{{ count($data['registros'] ?? []) }}
                    registros</x-filament::badge>
            </div>
        </x-slot>
        <x-slot name="description">{{ $data['periodo'] ?? '' }}</x-slot>

        <div
            class="overflow-x-auto rounded-xl ring-1 ring-gray-950/5 dark:ring-white/10 bg-white dark:bg-gray-900 shadow-sm">
            <table class="fi-ta-table w-full table-auto text-sm">
                <thead class="bg-transparent border-b border-gray-200 dark:border-white/10">
                    <tr>
                        <th class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">#</th>
                        @foreach($data['headers'] ?? [] as $h)
                            <th
                                class="px-4 py-3 text-{{ in_array($h, ['Nombre', 'CI', 'Grado']) ? 'left' : 'right' }} font-medium text-gray-700 dark:text-gray-300">
                                {{ $h }}
                            </th>
                        @endforeach
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-white/5">
                    @forelse($data['registros'] ?? [] as $i => $row)
                        <tr
                            class="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td class="px-4 py-3 text-gray-400 text-xs">{{ $i + 1 }}</td>
                            @foreach($row as $key => $val)
                                <td
                                    class="px-4 py-3 {{ in_array($key, ['nombre', 'ci', 'grado']) ? 'font-medium text-gray-950 dark:text-white' : 'text-right font-mono text-gray-700 dark:text-gray-300' }}">
                                    @if(is_numeric($val) && !in_array($key, ['ci']))
                                        Bs {{ number_format($val, 2) }}
                                    @else
                                        {{ $val }}
                                    @endif
                                </td>
                            @endforeach
                        </tr>
                    @empty
                        <tr>
                            <td colspan="{{ count($data['headers'] ?? []) + 1 }}"
                                class="px-4 py-12 text-center text-gray-500">
                                <div style="width: 3rem; height: 3rem;" class="mx-auto text-gray-400 mb-2">
                                    <x-heroicon-o-clipboard-document-list style="width: 100%; height: 100%;" />
                                </div>
                                No hay registros para este periodo.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </x-filament::section>
</x-filament-panels::page>