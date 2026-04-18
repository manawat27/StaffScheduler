<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=!messagesPerField.existsError('password','password-confirm'); section>
    <#if section = "header">
        <p class="ss-subtitle">${msg("updatePasswordTitle")}</p>
    <#elseif section = "form">
        <form id="kc-passwd-update-form" action="${url.loginAction}" method="post">
            <div class="ss-field">
                <label for="password-new" class="ss-label">${msg("passwordNew")}</label>
                <input tabindex="1" type="password" id="password-new" name="password-new" class="ss-input<#if messagesPerField.existsError('password')> ss-input-error</#if>" autofocus autocomplete="new-password" />
                <#if messagesPerField.existsError('password')>
                    <span class="ss-error-msg">${kcSanitize(messagesPerField.getFirstError('password'))?no_esc}</span>
                </#if>
            </div>

            <div class="ss-field">
                <label for="password-confirm" class="ss-label">${msg("passwordConfirm")}</label>
                <input tabindex="2" type="password" id="password-confirm" name="password-confirm" class="ss-input<#if messagesPerField.existsError('password-confirm')> ss-input-error</#if>" autocomplete="new-password" />
                <#if messagesPerField.existsError('password-confirm')>
                    <span class="ss-error-msg">${kcSanitize(messagesPerField.getFirstError('password-confirm'))?no_esc}</span>
                </#if>
            </div>

            <div class="ss-actions">
                <#if isAppInitiatedAction??>
                    <button tabindex="3" class="ss-btn ss-btn-primary" type="submit">${msg("doSubmit")}</button>
                    <button tabindex="4" class="ss-btn ss-btn-outline" type="submit" name="cancel-aia" value="true" style="margin-top: 0.75rem;">${msg("doCancel")}</button>
                <#else>
                    <button tabindex="3" class="ss-btn ss-btn-primary" type="submit">${msg("doSubmit")}</button>
                </#if>
            </div>
        </form>
    </#if>
</@layout.registrationLayout>
