<%@ page import="tgt.ItemLocation" %>



<div class="fieldcontain ${hasErrors(bean: itemLocationInstance, field: 'item', 'error')} required">
	<label for="item">
		<g:message code="itemLocation.item.label" default="Item" />
		<span class="required-indicator">*</span>
	</label>
	<g:select id="item" name="item.id" from="${tgt.Item.list()}" optionKey="id" required="" value="${itemLocationInstance?.item?.id}" class="many-to-one"/>
</div>

<div class="fieldcontain ${hasErrors(bean: itemLocationInstance, field: 'location', 'error')} required">
	<label for="location">
		<g:message code="itemLocation.location.label" default="Location" />
		<span class="required-indicator">*</span>
	</label>
	<g:select id="location" name="location.id" from="${tgt.Location.list()}" optionKey="id" required="" value="${itemLocationInstance?.location?.id}" class="many-to-one"/>
</div>

<div class="fieldcontain ${hasErrors(bean: itemLocationInstance, field: 'quantity', 'error')} required">
	<label for="quantity">
		<g:message code="itemLocation.quantity.label" default="Quantity" />
		<span class="required-indicator">*</span>
	</label>
	<g:field type="number" name="quantity" required="" value="${fieldValue(bean: itemLocationInstance, field: 'quantity')}"/>
</div>

