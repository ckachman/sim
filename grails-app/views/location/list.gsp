
<%@ page import="tgt.Location" %>
<!doctype html>
<html>
	<head>
		<meta name="layout" content="main">
		<g:set var="entityName" value="${message(code: 'location.label', default: 'Location')}" />
		<title><g:message code="default.list.label" args="[entityName]" /></title>
	</head>
	<body>
		<a href="#list-location" class="skip" tabindex="-1"><g:message code="default.link.skip.label" default="Skip to content&hellip;"/></a>
		<div class="nav" role="navigation">
			<ul>
				<li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
				<li><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></li>
			</ul>
		</div>
		<div id="list-location" class="content scaffold-list" role="main">
			<h1><g:message code="default.list.label" args="[entityName]" /></h1>
			<g:if test="${flash.message}">
			<div class="message" role="status">${flash.message}</div>
			</g:if>
			<table>
				<thead>
					<tr>
					
						<g:sortableColumn property="locId" title="${message(code: 'location.locId.label', default: 'Loc Id')}" />
					
						<g:sortableColumn property="state" title="${message(code: 'location.state.label', default: 'State')}" />
					
						<th><g:message code="location.store.label" default="Store" /></th>
					
					</tr>
				</thead>
				<tbody>
				<g:each in="${locationInstanceList}" status="i" var="locationInstance">
					<tr class="${(i % 2) == 0 ? 'even' : 'odd'}">
					
						<td><g:link action="show" id="${locationInstance.id}">${fieldValue(bean: locationInstance, field: "locId")}</g:link></td>
					
						<td>${fieldValue(bean: locationInstance, field: "state")}</td>
					
						<td>${fieldValue(bean: locationInstance, field: "store")}</td>
					
					</tr>
				</g:each>
				</tbody>
			</table>
			<div class="pagination">
				<g:paginate total="${locationInstanceTotal}" />
			</div>
		</div>
	</body>
</html>
