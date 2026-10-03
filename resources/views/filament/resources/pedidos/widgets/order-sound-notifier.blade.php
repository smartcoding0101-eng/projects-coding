<x-filament-widgets::widget>
    <x-filament::section class="border-t-4 border-t-amber-500 relative overflow-hidden" wire:poll.10s="checkNewOrders">
        
        <div x-data="{
            reminderInterval: null,
            isMuted: false,
            audioEl: null,
            init() {
                this.audioEl = document.getElementById('orderNotificationSound');
                
                window.addEventListener('check-order-sound', (e) => {
                    const event = e.detail;
                    console.log('Alerta verificada:', event);
                    const play = event[0]?.play || event.play;
                    const currentPending = event[0]?.hasPending || event.hasPending;

                    if (play) {
                        this.isMuted = false;
                        this.playSound();
                    }

                    if (currentPending) {
                        if (!this.reminderInterval && !this.isMuted) {
                            this.reminderInterval = setInterval(() => {
                                this.playSound();
                            }, 2000);
                        }
                    } else {
                        this.isMuted = false;
                        this.clearReminder();
                    }
                });
            },
            playSound() {
                if (this.audioEl && !this.isMuted) {
                    this.audioEl.currentTime = 0;
                    this.audioEl.play().catch(err => console.warn('Bloqueado autoplay', err));
                }
            },
            silenciarAlarma() {
                this.isMuted = true;
                this.clearReminder();
            },
            clearReminder() {
                if (this.reminderInterval) {
                    clearInterval(this.reminderInterval);
                    this.reminderInterval = null;
                }
                if (this.audioEl) {
                    this.audioEl.pause();
                }
            }
        }">
            <div class="flex items-center gap-4">
                <div class="p-3 bg-amber-500/10 rounded-full text-amber-500 flex items-center justify-center" style="width: 48px; height: 48px;">
                    <x-heroicon-o-bell-alert class="animate-pulse" style="width: 24px; height: 24px;" />
                </div>
                
                <div class="flex-1">
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white">Alerta de Nuevos Pedidos</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        Buscando pedidos pendientes cada 10 segundos...
                        @if($lastOrderCount > 0)
                            <span class="text-amber-600 font-bold ml-1">Hay {{ $lastOrderCount }} pendiente(s).</span>
                        @endif
                    </p>
                    <div class="flex flex-wrap items-center gap-2 mt-1">
                        <button type="button" @click="audioEl.play()" class="flex items-center text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-600 rounded-md border border-gray-300 transition-colors">
                            <x-heroicon-o-speaker-wave class="inline-block mr-1" style="width: 16px; height: 16px;" />
                            Probar
                        </button>
                        <button type="button" @click="silenciarAlarma()" class="flex items-center text-xs px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 dark:border-red-800 rounded-md border border-red-300 transition-colors">
                            <x-heroicon-o-speaker-x-mark class="inline-block mr-1" style="width: 16px; height: 16px;" />
                            Silenciar (Atendiendo)
                        </button>
                    </div>
                </div>
            </div>

            @if($soundUrl)
                <audio id="orderNotificationSound" src="{{ $soundUrl }}" preload="auto"></audio>
            @endif
        </div>

    </x-filament::section>
</x-filament-widgets::widget>
