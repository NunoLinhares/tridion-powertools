﻿using System;
using PowerTools.Editor.PowerTools.Client.Shared.Views;
using Tridion.Web.UI.Controls;
using Tridion.Web.UI.Core.Controls;

namespace PowerTools.Editor.PowerTools.Client.WorkflowNotificationSettings
{
	[ControlResourcesDependency(new Type[] { typeof(Popup), typeof(Tridion.Web.UI.Controls.Button), typeof(Stack), typeof(Dropdown), typeof(List) })]
    [ControlResources("PowerTools.WorkflowNotificationSettingsPopup")]
    public partial class WorkflowNotificationSettingsPopup : PowerToolsPageBase
	{
	}
}