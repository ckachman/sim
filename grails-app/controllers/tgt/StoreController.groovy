package tgt

import org.springframework.dao.DataIntegrityViolationException

class StoreController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def index() {
        redirect(action: "list", params: params)
    }

    def list() {
        params.max = Math.min(params.max ? params.int('max') : 10, 100)
        [storeInstanceList: Store.list(params), storeInstanceTotal: Store.count()]
    }

    def create() {
        [storeInstance: new Store(params)]
    }

    def save() {
        def storeInstance = new Store(params)
        if (!storeInstance.save(flush: true)) {
            render(view: "create", model: [storeInstance: storeInstance])
            return
        }

		flash.message = message(code: 'default.created.message', args: [message(code: 'store.label', default: 'Store'), storeInstance.id])
        redirect(action: "show", id: storeInstance.id)
    }

    def show() {
        def storeInstance = Store.get(params.id)
        if (!storeInstance) {
			flash.message = message(code: 'default.not.found.message', args: [message(code: 'store.label', default: 'Store'), params.id])
            redirect(action: "list")
            return
        }

        [storeInstance: storeInstance]
    }

    def edit() {
        def storeInstance = Store.get(params.id)
        if (!storeInstance) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'store.label', default: 'Store'), params.id])
            redirect(action: "list")
            return
        }

        [storeInstance: storeInstance]
    }

    def update() {
        def storeInstance = Store.get(params.id)
        if (!storeInstance) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'store.label', default: 'Store'), params.id])
            redirect(action: "list")
            return
        }

        if (params.version) {
            def version = params.version.toLong()
            if (storeInstance.version > version) {
                storeInstance.errors.rejectValue("version", "default.optimistic.locking.failure",
                          [message(code: 'store.label', default: 'Store')] as Object[],
                          "Another user has updated this Store while you were editing")
                render(view: "edit", model: [storeInstance: storeInstance])
                return
            }
        }

        storeInstance.properties = params

        if (!storeInstance.save(flush: true)) {
            render(view: "edit", model: [storeInstance: storeInstance])
            return
        }

		flash.message = message(code: 'default.updated.message', args: [message(code: 'store.label', default: 'Store'), storeInstance.id])
        redirect(action: "show", id: storeInstance.id)
    }

    def delete() {
        def storeInstance = Store.get(params.id)
        if (!storeInstance) {
			flash.message = message(code: 'default.not.found.message', args: [message(code: 'store.label', default: 'Store'), params.id])
            redirect(action: "list")
            return
        }

        try {
            storeInstance.delete(flush: true)
			flash.message = message(code: 'default.deleted.message', args: [message(code: 'store.label', default: 'Store'), params.id])
            redirect(action: "list")
        }
        catch (DataIntegrityViolationException e) {
			flash.message = message(code: 'default.not.deleted.message', args: [message(code: 'store.label', default: 'Store'), params.id])
            redirect(action: "show", id: params.id)
        }
    }
}
