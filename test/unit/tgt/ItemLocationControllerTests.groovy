package tgt



import org.junit.*
import grails.test.mixin.*

@TestFor(ItemLocationController)
@Mock(ItemLocation)
class ItemLocationControllerTests {


    def populateValidParams(params) {
      assert params != null
      // TODO: Populate valid properties like...
      //params["name"] = 'someValidName'
    }

    void testIndex() {
        controller.index()
        assert "/itemLocation/list" == response.redirectedUrl
    }

    void testList() {

        def model = controller.list()

        assert model.itemLocationInstanceList.size() == 0
        assert model.itemLocationInstanceTotal == 0
    }

    void testCreate() {
       def model = controller.create()

       assert model.itemLocationInstance != null
    }

    void testSave() {
        controller.save()

        assert model.itemLocationInstance != null
        assert view == '/itemLocation/create'

        response.reset()

        populateValidParams(params)
        controller.save()

        assert response.redirectedUrl == '/itemLocation/show/1'
        assert controller.flash.message != null
        assert ItemLocation.count() == 1
    }

    void testShow() {
        controller.show()

        assert flash.message != null
        assert response.redirectedUrl == '/itemLocation/list'


        populateValidParams(params)
        def itemLocation = new ItemLocation(params)

        assert itemLocation.save() != null

        params.id = itemLocation.id

        def model = controller.show()

        assert model.itemLocationInstance == itemLocation
    }

    void testEdit() {
        controller.edit()

        assert flash.message != null
        assert response.redirectedUrl == '/itemLocation/list'


        populateValidParams(params)
        def itemLocation = new ItemLocation(params)

        assert itemLocation.save() != null

        params.id = itemLocation.id

        def model = controller.edit()

        assert model.itemLocationInstance == itemLocation
    }

    void testUpdate() {
        controller.update()

        assert flash.message != null
        assert response.redirectedUrl == '/itemLocation/list'

        response.reset()


        populateValidParams(params)
        def itemLocation = new ItemLocation(params)

        assert itemLocation.save() != null

        // test invalid parameters in update
        params.id = itemLocation.id
        //TODO: add invalid values to params object

        controller.update()

        assert view == "/itemLocation/edit"
        assert model.itemLocationInstance != null

        itemLocation.clearErrors()

        populateValidParams(params)
        controller.update()

        assert response.redirectedUrl == "/itemLocation/show/$itemLocation.id"
        assert flash.message != null

        //test outdated version number
        response.reset()
        itemLocation.clearErrors()

        populateValidParams(params)
        params.id = itemLocation.id
        params.version = -1
        controller.update()

        assert view == "/itemLocation/edit"
        assert model.itemLocationInstance != null
        assert model.itemLocationInstance.errors.getFieldError('version')
        assert flash.message != null
    }

    void testDelete() {
        controller.delete()
        assert flash.message != null
        assert response.redirectedUrl == '/itemLocation/list'

        response.reset()

        populateValidParams(params)
        def itemLocation = new ItemLocation(params)

        assert itemLocation.save() != null
        assert ItemLocation.count() == 1

        params.id = itemLocation.id

        controller.delete()

        assert ItemLocation.count() == 0
        assert ItemLocation.get(itemLocation.id) == null
        assert response.redirectedUrl == '/itemLocation/list'
    }
}
