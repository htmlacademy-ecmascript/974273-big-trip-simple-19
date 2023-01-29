import NewPointEditorPresenter from './new-point-editor-presenter';

/**
 * @extends {NewPointEditorPresenter<PointEditorView>}
 */
export default class PointEditorPresenter extends NewPointEditorPresenter {

  /**
   * @override
   * @param {PointAdapter} point
   */
  async save(point) {
    point.id = this.view.dataset.id;
    await this.pointsModel.update(point);
  }

  /**
   * @override
   */
  handleNavigation() {
    this.view.close(false);

    if (this.location.pathname === '/edit') {
      const pointId = this.location.searchParams.get('id');
      const point = this.pointsModel.findById(pointId);

      // NOTE: В адресной строке проверяет есть ли такой поинт, если нет то выбрасит исключение...
      if (!point) {
        throw new Error(`Cannot edit point ${pointId} (it does not exist)`);
      }

      this.view.dataset.id = pointId;
      this.view.open();
      this.updateView(point);
    }
  }

  async delete(point) {
    await this.pointsModel.delete(point);
  }

  /**
   * @override
   * @param {Event} event
   */
  async handleViewReset(event) {
    event.preventDefault();

    this.view.awaitSave(true);

    try {
      const pointId = this.location.searchParams.get('id');

      await this.delete(pointId);

      this.view.close();
    }

    catch (exception) {
      this.view.shake();
    }

    this.view.awaitSave(false);
  }
}
