package tgt

import org.springframework.dao.DataIntegrityViolationException

class ItemLocationController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def index() {
        redirect(action: "list", params: params)
    }

    def list() {
        params.max = Math.min(params.max ? params.int('max') : 10, 100)
        [itemLocationInstanceList: ItemLocation.list(params), itemLocationInstanceTotal: ItemLocation.count()]
    }

    def create() {
        [itemLocationInstance: new ItemLocation(params)]
    }

    def save() {
        def itemLocationInstance = new ItemLocation(params)
        if (!itemLocationInstance.save(flush: true)) {
            render(view: "create", model: [itemLocationInstance: itemLocationInstance])
            return
        }

		flash.message = message(code: 'default.created.message', args: [message(code: 'itemLocation.label', default: 'ItemLocation'), itemLocationInstance.id])
        redirect(action: "show", id: itemLocationInstance.id)
    }

    def show() {
        def itemLocationInstance = ItemLocation.get(params.id)
        if (!itemLocationInstance) {
			flash.message = message(code: 'default.not.found.message', args: [message(code: 'itemLocation.label', default: 'ItemLocation'), params.id])
            redirect(action: "list")
            return
        }

        [itemLocationInstance: itemLocationInstance]
    }

    def edit() {
        def itemLocationInstance = ItemLocation.get(params.id)
        if (!itemLocationInstance) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'itemLocation.label', default: 'ItemLocation'), params.id])
            redirect(action: "list")
            return
        }

        [itemLocationInstance: itemLocationInstance]
    }

    def update() {
        def itemLocationInstance = ItemLocation.get(params.id)
        if (!itemLocationInstance) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'itemLocation.label', default: 'ItemLocation'), params.id])
            redirect(action: "list")
            return
        }

        if (params.version) {
            def version = params.version.toLong()
            if (itemLocationInstance.version > version) {
                itemLocationInstance.errors.rejectValue("version", "default.optimistic.locking.failure",
                          [message(code: 'itemLocation.label', default: 'ItemLocation')] as Object[],
                          "Another user has updated this ItemLocation while you were editing")
                render(view: "edit", model: [itemLocationInstance: itemLocationInstance])
                return
            }
        }

        itemLocationInstance.properties = params

        if (!itemLocationInstance.save(flush: true)) {
            render(view: "edit", model: [itemLocationInstance: itemLocationInstance])
            return
        }

		flash.message = message(code: 'default.updated.message', args: [message(code: 'itemLocation.label', default: 'ItemLocation'), itemLocationInstance.id])
        redirect(action: "show", id: itemLocationInstance.id)
    }

    def delete() {
        def itemLocationInstance = ItemLocation.get(params.id)
        if (!itemLocationInstance) {
			flash.message = message(code: 'default.not.found.message', args: [message(code: 'itemLocation.label', default: 'ItemLocation'), params.id])
            redirect(action: "list")
            return
        }

        try {
            itemLocationInstance.delete(flush: true)
			flash.message = message(code: 'default.deleted.message', args: [message(code: 'itemLocation.label', default: 'ItemLocation'), params.id])
            redirect(action: "list")
        }
        catch (DataIntegrityViolationException e) {
			flash.message = message(code: 'default.not.deleted.message', args: [message(code: 'itemLocation.label', default: 'ItemLocation'), params.id])
            redirect(action: "show", id: params.id)
        }
    }
}
