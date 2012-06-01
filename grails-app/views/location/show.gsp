
<%@ page import="tgt.Location" %>
<!doctype html>
<html>
	<head>
		<meta name="layout" content="main">
		<g:set var="entityName" value="${message(code: 'location.label', default: 'Location')}" />
		<title><g:message code="default.show.label" args="[entityName]" /></title>
	</head>
	<body>
		<a href="#show-location" class="skip" tabindex="-1"><g:message code="default.link.skip.label" default="Skip to content&hellip;"/></a>
		<div class="nav" role="navigation">
			<ul>
				<li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
				<li><g:link class="list" action="list"><g:message code="default.list.label" args="[entityName]" /></g:link></li>
				<li><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></li>
			</ul>
		</div>
		<div id="show-location" class="content scaffold-show" role="main">
			<h1><g:message code="default.show.label" args="[entityName]" /></h1>
			<g:if test="${flash.message}">
			<div class="message" role="status">${flash.message}</div>
			</g:if>
			<ol class="property-list location">
			
				<g:if test="${locationInstance?.locId}">
				<li class="fieldcontain">
					<span id="locId-label" class="property-label"><g:message code="location.locId.label" default="Loc Id" /></span>
					
						<span class="property-value" aria-labelledby="locId-label"><g:fieldValue bean="${locationInstance}" field="locId"/></span>
					
				</li>
				</g:if>
			
				<g:if test="${locationInstance?.state}">
				<li class="fieldcontain">
					<span id="state-label" class="property-label"><g:message code="location.state.label" default="State" /></span>
					
						<span class="property-value" aria-labelledby="state-label"><g:fieldValue bean="${locationInstance}" field="state"/></span>
					
				</li>
				</g:if>
			
				<g:if test="${locationInstance?.itemLocations}">
				<li class="fieldcontain">
					<span id="itemLocations-label" class="property-label"><g:message code="location.itemLocations.label" default="Item Locations" /></span>
					
						<g:each in="${locationInstance.itemLocations}" var="i">
						<span class="property-value" aria-labelledby="itemLocations-label"><g:link controller="itemLocation" action="show" id="${i.id}">${i?.encodeAsHTML()}</g:link></span>
						</g:each>
					
				</li>
				</g:if>
			
				<g:if test="${locationInstance?.store}">
				<li class="fieldcontain">
					<span id="store-label" class="property-label"><g:message code="location.store.label" default="Store" /></span>
					
						<span class="property-value" aria-labelledby="store-label"><g:link controller="store" action="show" id="${locationInstance?.store?.id}">${locationInstance?.store?.encodeAsHTML()}</g:link></span>
					
				</li>
				</g:if>
			
			</ol>
			<g:form>
				<fieldset class="buttons">
					<g:hiddenField name="id" value="${locationInstance?.id}" />
					<g:link class="edit" action="edit" id="${locationInstance?.id}"><g:message code="default.button.edit.label" default="Edit" /></g:link>
					<g:actionSubmit class="delete" action="delete" value="${message(code: 'default.button.delete.label', default: 'Delete')}" onclick="return confirm('${message(code: 'default.button.delete.confirm.message', default: 'Are you sure?')}');" />
				</fieldset>
			</g:form>
		</div>
	</body>
</html>
