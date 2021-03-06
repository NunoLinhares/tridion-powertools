﻿using System;
using System.Globalization;
using System.IO;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using PowerTools.Model.Exceptions;
using PowerTools.Model.Progress;


namespace PowerTools.Model.Services
{
	[ServiceBehavior(InstanceContextMode = InstanceContextMode.Single, ConcurrencyMode = ConcurrencyMode.Multiple)]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	[ServiceContract(Namespace = "PowerTools.Model.Services")]
	public class FieldRemover : BaseService
	{
		class FieldRemoverParameters
		{
			public string Directory { get; set; }
			public string FolderUri { get; set; }
			public string SchemaUri { get; set; }
		}

		[OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
		public ServiceProcess Execute(string directory, string folderUri, string schemaUri)
		{
			if (string.IsNullOrEmpty(directory))
			{
				throw new ArgumentNullException("directory");
			}

			if (string.IsNullOrEmpty(directory))
			{
				throw new ArgumentNullException("folderUri");
			}

			if (string.IsNullOrEmpty(directory))
			{
				throw new ArgumentNullException("schemaUri");
			}

			FieldRemoverParameters arguments = new FieldRemoverParameters { Directory = directory, FolderUri = folderUri, SchemaUri = schemaUri };
			return ExecuteAsync(arguments);
		}

		[OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
		public override ServiceProcess GetProcessStatus(string Id)
		{
			return base.GetProcessStatus(Id);
		}

		public override void Process(ServiceProcess process, object arguments)
		{
			FieldRemoverParameters parameters = (FieldRemoverParameters)arguments;
			if (!Directory.Exists(parameters.Directory))
			{
				throw new BaseServiceException(string.Format(CultureInfo.InvariantCulture, "Directory '{0}' does not exist.", parameters.Directory));
			}

			var client = PowerTools.Common.CoreService.Client.GetCoreService();

			try
			{

				string[] files = Directory.GetFiles(parameters.Directory);
				int i = 0;

				foreach (string file in files)
				{
					process.SetStatus("Importing image: " + Path.GetFileName(file));
					process.SetCompletePercentage(++i * 100 / files.Length);
					System.Threading.Thread.Sleep(500); // Temp, until it actually does something :)
				}

				process.Complete();

			}
			finally
			{
				if (client != null)
				{
					client.Close();
				}
			}
		}
	}
}



