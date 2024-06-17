<template>
    <div class="wrapper">
        <Toast />
        <div class="variant">
            <div>
                <RadioButton v-model="mode" inputId="ingredient1" value="Вход" />
                <label for="ingredient1" class="ml-2">Вход</label>
            </div>
            <div>
                <RadioButton v-model="mode" inputId="ingredient2" value="Регистрация" />
                <label for="ingredient2" class="ml-2">Регистрация</label>
            </div>
        </div>

        <FloatLabel v-if="mode === 'Регистрация'">
            <InputText class="field" id="username" v-model="username" />
            <label for="username">Имя пользователя</label>
        </FloatLabel>
        <FloatLabel>
            <InputText class="field" id="email" v-model="email" />
            <label for="email">Почта</label>
        </FloatLabel>
        <FloatLabel>
            <InputText v-if="mode !== 'Регистрация'" class="field" type="password" v-model="password" />
            <Password v-if="mode == 'Регистрация'" v-model="password" toggleMask />
            <label for="password">Пароль</label>
        </FloatLabel>

        <Button :label="mode" @click="auth" />
    </div>
</template>

<script lang="ts" setup>

const supabase = useSupabaseClient();
const toast = useToast();
const router = useRouter();

const email = ref<string>('');
const password = ref<string>('');
const username = ref<string>('');
const mode = ref<'Вход' | 'Регистрация'>('Вход');

interface VerificationResult {
    isValid: boolean;
    error: string;
}

const verificator = (username: string, email: string, password: string): VerificationResult => {
    if (mode.value !== 'Вход') {
        if (username.trim() === "") {
            return { isValid: false, error: "Имя пользователя не может быть пустым." };
        }
        if (username.length < 3 || username.length > 20) {
            return { isValid: false, error: "Имя пользователя должно быть от 3 до 20 символов." };
        }
        const usernameRegex = /^[a-zA-Zа-яА-Я0-9_]+$/;
        if (!usernameRegex.test(username)) {
            return { isValid: false, error: "Имя пользователя может содержать только буквы, цифры и символ подчеркивания." };
        }
    }

    if (email.trim() === "") {
        return { isValid: false, error: "Электронная почта не может быть пустой." };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, error: "Некорректный формат электронной почты." };
    }

    if (password.trim() === "") {
        return { isValid: false, error: "Пароль не может быть пустым." };
    }
    if (mode.value !== 'Вход') {
        if (password.length < 8) {
            return { isValid: false, error: "Пароль должен быть не менее 8 символов." };
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
        if (!passwordRegex.test(password)) {
            return { isValid: false, error: "Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву и одну цифру." };
        }
    }

    return { isValid: true, error: "" };
};

const auth = async () => {
    const verifier = verificator(username.value, email.value, password.value);
    if (!verifier.isValid) {
        toast.add({ severity: 'error', summary: 'Ошибка', detail: verifier.error, life: 3000 });
        return;
    }

    if (mode.value === 'Вход') {
        await login(email.value, password.value);
    } else {
        await registration(username.value, email.value, password.value);
    }
};

const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) {
        toast.add({ severity: 'error', summary: 'Ошибка', detail: error.message, life: 3000 });
    } else {
        router.push('/profile');
    }
};

const registration = async (username: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });
    if (error) {
        toast.add({ severity: 'error', summary: 'Ошибка', detail: error.message, life: 3000 });
    } else {
        const datass = await supabase.from('profile').insert({ user_id: data.user?.id, username }).select();
        console.log(datass)
        router.push('/profile');
    }
};
</script>

<style scoped>
.wrapper {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    height: 90vh;
    gap: 3cap;
}

.field {
    width: 24cap;
}

.variant {
    display: flex;
    gap: 2cap;
}
</style>

<style>
:root {
    overflow-y: hidden;
}
</style>
