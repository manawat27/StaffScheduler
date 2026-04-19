<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=true displayMessage=!messagesPerField.existsError('username'); section>
    <#if section = "header">
        <p class="ss-subtitle">${msg("emailForgotTitle")}</p>
    <#elseif section = "form">
        <form id="kc-reset-password-form" action="${url.loginAction}" method="post">
            <div class="ss-field">
                <label for="username" class="ss-label">
                    <#if !realm.loginWithEmailAllowed>${msg("username")}<#elseif !realm.registrationEmailAsUsername>${msg("usernameOrEmail")}<#else>${msg("email")}</#if>
                </label>
                <input tabindex="1" type="text" id="username" name="username" class="ss-input<#if messagesPerField.existsError('username')> ss-input-error</#if>" autofocus value="${(auth.attemptedUsername!'')}" autocomplete="username" />
                <#if messagesPerField.existsError('username')>
                    <span class="ss-error-msg">${kcSanitize(messagesPerField.getFirstError('username'))?no_esc}</span>
                </#if>
            </div>

            <div class="ss-actions">
                <button tabindex="2" class="ss-btn ss-btn-primary" type="submit">${msg("doSubmit")}</button>
            </div>
            <div class="ss-actions" style="margin-top: 0.75rem;">
                <a href="${url.loginUrl}" class="ss-btn ss-btn-outline">${msg("backToLogin")}</a>
            </div>
        </form>
    <#elseif section = "info">
        <span>${msg("emailInstruction")}</span>
    </#if>
</@layout.registrationLayout>
