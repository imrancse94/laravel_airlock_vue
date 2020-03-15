<template>
    <div class="container-scroller">
        <div class="container-fluid page-body-wrapper full-page-wrapper">
            <div class="content-wrapper d-flex align-items-center auth">
                <div class="row flex-grow">
                    <div class="col-lg-4 mx-auto">
                        <div class="auth-form-light text-left p-5">
                            <div class="brand-logo">
                                <img src="/storage/images/logo.svg">
                            </div>
                            <h4>Hello! let's get started</h4>
                            <h6 class="font-weight-light">Sign in to continue.</h6>
                            <form autocomplete="off" class="pt-3" @submit.prevent="login" @keydown="form.onKeydown($event)">
                                <div class="form-group">
                                    <input v-model="form.email" :class="{ 'is-invalid': form.errors.has('email') }" type="email" class="form-control form-control-lg" id="exampleInputEmail1"
                                           placeholder="Username">
                                    <has-error :form="form" field="email" />
                                </div>
                                <div class="form-group">
                                    <input v-model="form.password" :class="{ 'is-invalid': form.errors.has('password') }" type="password" class="form-control form-control-lg"
                                           id="exampleInputPassword1" placeholder="Password">
                                    <has-error :form="form" field="password" />
                                </div>
                                <div class="mt-3">

                                    <button class="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn">Sign In</button>

                                </div>
                                <div class="my-2 d-flex justify-content-between align-items-center">
                                    <div class="form-check">
                                        <label class="form-check-label text-muted">
                                            <input type="checkbox" class="form-check-input"> Keep me signed in </label>
                                    </div>
                                    <a href="#" class="auth-link text-black">Forgot password?</a>
                                </div>
                                <div class="text-center mt-4 font-weight-light"> Don't have an account? <a
                                    href="register.html" class="text-primary">Create</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


</template>

<script>
    import { Form, HasError, AlertError } from 'vform'
    export default {
        components:{
            HasError,
            AlertError
        },
        data: () => ({
            form: new Form({
                email: '',
                password: ''
            }),
            remember: false
        }),
        mounted:function(){
            //this.initial()
        },

        methods:{
            login:function(){
                this.$api.get('/airlock/csrf-cookie').then(response => {
                    this.process ();
                })
            },
            async process () {
                try {
                    // Submit the form.
                    const { data } = await this.form.post('/api/login')
                    console.log(data);

                    // Save the token.
                    this.$store.dispatch('auth/saveToken', {
                        token: data.email,
                        remember: this.remember
                    })

                    // Fetch the user.
                    await this.$store.dispatch('auth/fetchUser')

                    // Redirect welcome.
                    this.$router.push({ name: 'welcome' })
                } catch (e) {

                }

            }
        },
    }
</script>

