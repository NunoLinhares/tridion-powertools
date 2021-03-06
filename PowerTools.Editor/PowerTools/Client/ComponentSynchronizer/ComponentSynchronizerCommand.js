﻿Type.registerNamespace("PowerTools.Commands");

/**
* Implements Component Synchronizer command.
* @constructor
*/
PowerTools.Commands.ComponentSynchronizer = function ComponentSynchronizerCommand$constructor()
{
	Type.enableInterface(this, "PowerTools.Commands.ComponentSynchronizer");
	this.addInterface("PowerTools.BaseCommand", ["ComponentSynchronizer"]);

	this._isPopupOpen = false;
	this._currentSchema = null;
	this._currentPublication = null;
};

/**
* Executes the command.
* @param {Tridion.Cme.Selection] selection. The selected items in the list
*/
PowerTools.Commands.ComponentSynchronizer.prototype._execute = function ComponentSynchronizerCommand$_execute(selection)
{
	if (this._isPopupOpen)
	{
		return;
	}

	var validSelection = this.isValidSelection(selection);
	if (!validSelection)
	{
		var msg = $messages.createMessage("Tridion.Cme.Model.WarningMessage", "SELECTION MUST BE EITHER: ", "- A Schema \r\n - A Component \r\n - Multiple Components based on the same Schema \r\n ", true, true);
		$messages.registerMessage(msg);
		return;
	}

	var uriSelection = selection.getItem(0);
	var baseElement = $("#contentsplitter_container");
	var iFrame = $("#CustomPagesFrame");

	var PopUpUrl = $ptUtils.expandPath("/PowerTools/Client/ComponentSynchronizer/ComponentSynchronizer.aspx"); // +"#folderId=" + uriSelection;
	//TODO: USING ROOT FOLDER FOR TEMPORARY LOCATION
	var publication = $models.getItem(this._currentPublication);
	this._rootFolder = publication.getRootFolderId();

	$log.message("Opening Popup for Schema: " + this._currentSchema);
	this._popup = $popup.create(PopUpUrl, "toolbar=no,width=750px,height=630px,resizable=false,scrollbars=false", { sel: selection, schema: this._currentSchema, pub: this._currentPublication, folder: this._rootFolder });
	$evt.addEventHandler(this._popup, "unload", this.getDelegate(this._onPopupCanceled));

	this._popup.open();
	this._isPopupOpen = true;
};

/**
* On Popup Canceled Event. 
* @param {Tridion.Core.Event}. The cancel/unload event.
*/
PowerTools.Commands.ComponentSynchronizer.prototype._onPopupCanceled = function ComponentSynchronizerCommand$_onPopupCanceled(event)
{
	this._popup.dispose();
	this._popup = null;
	this._isPopupOpen = false;
};

/**
* Checks wether the Command is Enabled/Available or not
* @param {Tridion.Cme.Selection] selection. The selected items in the list
*/
PowerTools.Commands.ComponentSynchronizer.prototype.isValidSelection = function ComponentSynchronizerCommand$isValidSelection(selection)
{
	if (!selection)
	{
		return false;
	}

	var items = selection.getItems();
	switch (items.length)
	{
		case 0: 
			return false;
		case 1:
			var itemId = selection.getItem(0);
			var item = $models.getItem(itemId);
			if (item)
			{
				if (item.getItemType() != $const.ItemType.SCHEMA && item.getItemType() != $const.ItemType.COMPONENT)
				{
					return false;
				} 
				else
				{
					this._currentPublication = item.getPublicationId();
					if (item.getItemType() == $const.ItemType.SCHEMA)
					{
						this._currentSchema = item.getId();
					}
					else
					{
						this._currentSchema = item.getSchema().getId();
					}
				}
			}
			break;

		default:
			for (var i = 0, len = items.length; i < len; i++)
			{
				var itemId = selection.getItem(0);
				var item = $models.getItem(itemId);

				if (item)
				{
					if (item.getItemType() != $const.ItemType.COMPONENT)
					{
						return false;
					}
				}
			}
			break;
	}

	return true;
}