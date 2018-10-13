class RegistrationCredentials {

    constructor(email, username, password, passwordConf) {
        this.email = email
        this.username = username
        this.password = password
        this.passwordConf = passwordConf
    }

    doPasswordsMatch() {
        return this.password == this.passwordConf
    }
}

module.exports = RegistrationCredentials