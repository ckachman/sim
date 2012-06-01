<%@ page import="tgt.Item" %>



<div class="fieldcontain ${hasErrors(bean: itemInstance, field: 'sku', 'error')} required">
	<label for="sku">
		<g:message code="item.sku.label" default="Sku" />
		<span class="required-indicator">*</span>
	</label>
	<g:textField name="sku" required="" value="${itemInstance?.sku}"/>
</div>

<div class="fieldcontain ${hasErrors(bean: itemInstance, field: 'description', 'error')} required">
	<label for="description">
		<g:message code="item.description.label" default="Description" />
		<span class="required-indicator">*</span>
	</label>
	<g:textArea name="description" cols="40" rows="5" maxlength="1000" required="" value="${itemInstance?.description}"/>
</div>

<div class="fieldcontain ${hasErrors(bean: itemInstance, field: 'status', 'error')} ">
	<label for="status">
		<g:message code="item.status.label" default="Status" />
		
	</label>
	<g:select name="status" from="${itemInstance.constraints.status.inList}" value="${itemInstance?.status}" valueMessagePrefix="item.status" noSelection="['': '']"/>
</div>

<div class="fieldcontain ${hasErrors(bean: itemInstance, field: 'state', 'error')} required">
	<label for="state">
		<g:message code="item.state.label" default="State" />
		<span class="required-indicator">*</span>
	</label>
	<g:select name="state" from="${itemInstance.constraints.state.inList}" required="" value="${itemInstance?.state}" valueMessagePrefix="item.state"/>
</div>

<div class="fieldcontain ${hasErrors(bean: itemInstance, field: 'itemLocations', 'error')} ">
	<label for="itemLocations">
		<g:message code="item.itemLocations.label" default="Item Locations" />
		
	</label>
	
<ul class="one-to-many">
<g:each in="${itemInstance?.itemLocations?}" var="i">
    <li><g:link controller="itemLocation" action="show" id="${i.id}">${i?.encodeAsHTML()}</g:link></li>
</g:each>
<li class="add">
<g:link controller="itemLocation" action="create" params="['item.id': itemInstance?.id]">${message(code: 'default.add.label', args: [message(code: 'itemLocation.label', default: 'ItemLocation')])}</g:link>
</li>
</ul>

</div>

