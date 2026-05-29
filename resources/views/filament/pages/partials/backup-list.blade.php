<div class="space-y-4">
    @php
        $backupPath = config('backup.backup.destination.disks.0', 'local');
        $backupName = config('backup.backup.name', 'laravel-backup');
        $disk = \Illuminate\Support\Facades\Storage::disk($backupPath);
        $files = [];

        try {
            $allFiles = $disk->allFiles($backupName);
            foreach ($allFiles as $file) {
                if (str_ends_with($file, '.zip')) {
                    $files[] = [
                        'name' => basename($file),
                        'path' => $file,
                        'size' => number_format($disk->size($file) / 1048576, 2) . ' MB',
                        'date' => \Carbon\Carbon::createFromTimestamp($disk->lastModified($file))->format('d/m/Y H:i'),
                    ];
                }
            }
            // Sort by date descending
            usort($files, fn($a, $b) => strcmp($b['date'], $a['date']));
        } catch (\Exception $e) {
            // Backup directory may not exist yet
        }
    @endphp

    @if(count($files) > 0)
        <div
            class="overflow-x-auto rounded-xl ring-1 ring-gray-950/5 dark:ring-white/10 bg-white dark:bg-gray-900 shadow-sm">
            <table class="w-full table-fixed text-sm" style="table-layout: fixed;">
                <thead class="border-b border-gray-200 dark:border-white/10">
                    <tr>
                        <th style="text-align: center; width: 50%;"
                            class="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Archivo</th>
                        <th style="text-align: center; width: 20%;"
                            class="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Tamaño</th>
                        <th style="text-align: center; width: 30%;"
                            class="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Fecha</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-white/5">
                    @foreach($files as $file)
                        <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td style="text-align: center;"
                                class="px-4 py-3 font-mono text-xs text-gray-950 dark:text-white truncate">{{ $file['name'] }}
                            </td>
                            <td style="text-align: center;" class="px-4 py-3 font-mono text-gray-600 dark:text-gray-400">
                                {{ $file['size'] }}</td>
                            <td style="text-align: center;" class="px-4 py-3 text-gray-600 dark:text-gray-400">
                                {{ $file['date'] }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @else
        <div class="text-center py-8 text-gray-500 dark:text-gray-400">
            <div style="width: 1.5rem; height: 1.5rem;" class="mx-auto text-gray-400 mb-3">
                <x-heroicon-o-server-stack style="width: 100%; height: 100%;" />
            </div>
            <p class="font-medium">No hay respaldos disponibles</p>
            <p class="text-sm mt-1">Use el botón "Backup Manual" en la barra superior para crear uno.</p>
        </div>
    @endif
</div>