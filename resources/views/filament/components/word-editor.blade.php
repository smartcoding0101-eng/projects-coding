@once
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.2/tinymce.min.js" referrerpolicy="origin"></script>
@endonce

<x-dynamic-component
    :component="$getFieldWrapperView()"
    :field="$field"
>
    <div
        x-data="{
            state: $wire.{{ $applyStateBindingModifiers('entangle(\'' . $getStatePath() . '\')') }}
        }"
        wire:ignore
        x-init="
            tinymce.init({
                target: $el.querySelector('textarea'),
                plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table wordcount',
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | numlist bullist | removeformat',
                height: 400,
                branding: false,
                promotion: false,
                setup: function (editor) {
                    editor.on('blur', function () {
                        state = editor.getContent();
                    });
                    editor.on('init', function () {
                        if (state) {
                            editor.setContent(state);
                        }
                    });
                    $watch('state', value => {
                        if (value !== editor.getContent()) {
                            editor.setContent(value || '');
                        }
                    });
                }
            });
        "
    >
        <textarea class="w-full" style="min-height: 400px; display: none;"></textarea>
    </div>
</x-dynamic-component>
