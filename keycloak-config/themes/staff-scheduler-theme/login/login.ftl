<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=!messagesPerField.existsError('username','password') displayInfo=(realm.password && realm.registrationAllowed && !registrationDisabled??); section>
    <#if section = "header">
        <p class="ss-subtitle">${msg("loginAccountTitle")}</p>
    <#elseif section = "form">
        <#if realm.password>
            <form id="kc-form-login" onsubmit="login.disabled = true; return true;" action="${url.loginAction}" method="post">
                <div class="ss-field">
                    <label for="username" class="ss-label">
                        <#if !realm.loginWithEmailAllowed>${msg("username")}<#elseif !realm.registrationEmailAsUsername>${msg("usernameOrEmail")}<#else>${msg("email")}</#if>
                    </label>
                    <input tabindex="1" id="username" class="ss-input<#if messagesPerField.existsError('username','password')> ss-input-error</#if>" name="username" value="${(login.username!'')}" type="text" autofocus autocomplete="username" />
                    <#if messagesPerField.existsError('username','password')>
                        <span class="ss-error-msg">${kcSanitize(messagesPerField.getFirstError('username','password'))?no_esc}</span>
                    </#if>
                </div>

                <div class="ss-field">
                    <label for="password" class="ss-label">${msg("password")}</label>
                    <input tabindex="2" id="password" class="ss-input" name="password" type="password" autocomplete="current-password" />
                </div>

                <div class="ss-options-row">
                    <#if realm.rememberMe && !(useSocialLogin!false)>
                        <label class="ss-checkbox">
                            <input tabindex="3" id="rememberMe" name="rememberMe" type="checkbox" <#if login.rememberMe??>checked</#if>>
                            <span>${msg("rememberMe")}</span>
                        </label>
                    <#else>
                        <div></div>
                    </#if>
                    <#if realm.resetPasswordAllowed>
                        <a tabindex="5" href="${url.loginResetCredentialsUrl}" class="ss-link">${msg("doForgotPassword")}</a>
                    </#if>
                </div>

                <div class="ss-actions">
                    <input type="hidden" id="id-hidden-input" name="credentialId" <#if auth?has_content && auth.selectedCredential?has_content>value="${auth.selectedCredential}"</#if>/>
                    <button tabindex="4" class="ss-btn ss-btn-primary" name="login" id="kc-login" type="submit">${msg("doLogIn")}</button>
                </div>
            </form>
        </#if>
    <#elseif section = "info">
        <#if realm.password && realm.registrationAllowed && !registrationDisabled??>
            ${msg("noAccount")} <a href="${url.registrationUrl}" class="ss-link">${msg("doRegister")}</a>
        </#if>
    <#elseif section = "socialProviders">
        <#if realm.password && social?? && social.providers?has_content>
            <div class="ss-social">
                <div class="ss-divider"><span>or</span></div>
                <#list social.providers as p>
                    <a id="social-${p.alias}" class="ss-btn ss-btn-social" href="${p.loginUrl}">
                        <#if p.iconClasses?has_content><i class="${p.iconClasses!}" aria-hidden="true"></i> </#if>
                        <span>${p.displayName!}</span>
                    </a>
                </#list>
            </div>
        </#if>
    </#if>
</@layout.registrationLayout>
