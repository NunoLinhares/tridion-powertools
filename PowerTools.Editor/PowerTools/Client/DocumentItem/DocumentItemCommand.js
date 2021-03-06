Type.registerNamespace("PowerTools.Commands");

PowerTools.Commands.DocumentItem = function DocumentItemCommand$constructor() 
{
    Type.enableInterface(this, "PowerTools.Commands.DocumentItem");
    this.addInterface("PowerTools.BaseCommand", ["DocumentItem"]);
};

PowerTools.Commands.DocumentItem.prototype.isValidSelection = function DocumentItemCommand$isValidSelection(selection)
{
    if (selection.getItems().length > 1)
	{
        return false;
	}

    var itemID = selection.getItem(0);
	return ($models.getItemType(itemID) == $const.ItemType.SCHEMA);
};

PowerTools.Commands.DocumentItem.prototype._execute = function DocumentItemCommand$_execute(selection) 
{
    var itemID = selection.getItem(0);
    var path = $config.expandEditorPath("/PowerTools/Client/DocumentItem/SchemaDefinition.docx?id=" + itemID, "PowerTools");
    window.location = document.location.protocol + "//" + document.location.host + path;
};
