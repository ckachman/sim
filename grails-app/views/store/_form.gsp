<%@ page import="tgt.Store" %>



<div class="fieldcontain ${hasErrors(bean: storeInstance, field: 'locations', 'error')} ">
	<label for="locations">
		<g:message code="store.locations.label" default="Locations" />
		
	</label>
	
<ul class="one-to-many">
<g:each in="${storeInstance?.locations?}" var="l">
    <li><g:link controller="location" action="show" id="${l.id}">${l?.encodeAsHTML()}</g:link></li>
</g:each>
<li class="add">
<g:link controller="location" action="create" params="['store.id': storeInstance?.id]">${message(code: 'default.add.label', args: [message(code: 'location.label', default: 'Location')])}</g:link>
</li>
</ul>

</div>

