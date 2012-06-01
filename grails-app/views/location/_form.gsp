<%@ page import="tgt.Location" %>



<div class="fieldcontain ${hasErrors(bean: locationInstance, field: 'locId', 'error')} required">
	<label for="locId">
		<g:message code="location.locId.label" default="Loc Id" />
		<span class="required-indicator">*</span>
	</label>
	<g:textField name="locId" required="" value="${locationInstance?.locId}"/>
</div>

<div class="fieldcontain ${hasErrors(bean: locationInstance, field: 'state', 'error')} required">
	<label for="state">
		<g:message code="location.state.label" default="State" />
		<span class="required-indicator">*</span>
	</label>
	<g:select name="state" from="${locationInstance.constraints.state.inList}" required="" value="${locationInstance?.state}" valueMessagePrefix="location.state"/>
</div>

<div class="fieldcontain ${hasErrors(bean: locationInstance, field: 'itemLocations', 'error')} ">
	<label for="itemLocations">
		<g:message code="location.itemLocations.label" default="Item Locations" />
		
	</label>
	
<ul class="one-to-many">
<g:each in="${locationInstance?.itemLocations?}" var="i">
    <li><g:link controller="itemLocation" action="show" id="${i.id}">${i?.encodeAsHTML()}</g:link></li>
</g:each>
<li class="add">
<g:link controller="itemLocation" action="create" params="['location.id': locationInstance?.id]">${message(code: 'default.add.label', args: [message(code: 'itemLocation.label', default: 'ItemLocation')])}</g:link>
</li>
</ul>

</div>

<div class="fieldcontain ${hasErrors(bean: locationInstance, field: 'store', 'error')} required">
	<label for="store">
		<g:message code="location.store.label" default="Store" />
		<span class="required-indicator">*</span>
	</label>
	<g:select id="store" name="store.id" from="${tgt.Store.list()}" optionKey="id" required="" value="${locationInstance?.store?.id}" class="many-to-one"/>
</div>

