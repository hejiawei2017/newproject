
module.exports = {
	errorLog(error) {
		const msg = error.stack ? error.stack : JSON.stringify(error);
		this.logger.error(error);
		this.model_hd.Log.error(msg);
	}
}
