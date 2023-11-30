package com.prtech.fr.ws;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;

import com.prtech.svarog_interfaces.ISvConfigurationMulti;
import com.prtech.svarog_interfaces.ISvCore;

import org.apache.logging.log4j.Logger;

import com.google.gson.JsonObject;
import com.prtech.svarog.SvConf;
import com.prtech.svarog.SvCore;
import com.prtech.svarog.SvException;
import com.prtech.svarog.SvReader;
import com.prtech.svarog.SvWriter;
import com.prtech.svarog.svCONST;
import com.prtech.svarog_common.DbDataObject;

public class FarmRegistryConfigurator implements ISvConfigurationMulti {

	static final Logger log4j = SvConf.getLogger(FarmRegistryConfigurator.class);
	
	SvReader svr = null;
	SvWriter svw = null;

	@Override
	public int executionOrder(UpdateType updateType) {
		return 0;
	}

	@Override
	public String beforeSchemaUpdate(Connection conn, ISvCore core, String schema) throws Exception {
		return null;
	}

	@Override
	public String beforeLabelsUpdate(Connection conn, ISvCore core, String schema) throws Exception {
		return null;
	}

	@Override
	public String beforeCodesUpdate(Connection conn, ISvCore core, String schema) throws Exception {
		return null;
	}

	@Override
	public String beforeTypesUpdate(Connection conn, ISvCore core, String schema) throws Exception {
		return null;
	}

	@Override
	public String beforeLinkTypesUpdate(Connection conn, ISvCore core, String schema) throws Exception {
		return null;
	}

	@Override
	public String beforeAclUpdate(Connection conn, ISvCore core, String schema) throws Exception {

		return null;
	}

	@Override
	public String beforeSidAclUpdate(Connection conn, ISvCore core, String schema) throws Exception {
		return null;
	}

	@Override
	public String afterUpdate(Connection conn, ISvCore core, String schema) throws Exception {
		try (SvReader svr1 = new SvReader((SvCore) core); SvWriter svw1 = new SvWriter(svr1);) {
			svw = svw1;
			svr = svr1;
			svw.setAutoCommit(false);
			createExtendedMenuPlugin(svw);
			svw.dbCommit();
		}
		return null;
	}

	
	private void createExtendedMenuPlugin(SvWriter svw) throws SvException {
		DbDataObject dboGridTablePlugin = new DbDataObject(svCONST.OBJECT_TYPE_PERUN_PLUGIN);
		dboGridTablePlugin.setVal("CONTEXT_NAME", "grid-table");
		dboGridTablePlugin.setVal("LABEL_CODE", "perun.plugin.grid_table");
		dboGridTablePlugin.setVal("MENU_CONF", tableAsGrid());
		dboGridTablePlugin.setVal("CONTEXT_MENU_CONF", null);
		dboGridTablePlugin.setVal("PERMISSION_CODE", "/");
		dboGridTablePlugin.setVal("IMG_PATH", "/");
		dboGridTablePlugin.setVal("JAVASCRIPT_PATH", "/");
		dboGridTablePlugin.setVal("SORT_ORDER", 1);
		dboGridTablePlugin.setVal("VERSION", 1);
		dboGridTablePlugin.setStatus(svCONST.STATUS_VALID);
		svw.saveObject(dboGridTablePlugin, false);
		
		DbDataObject dboSingleFormPlugin = new DbDataObject(svCONST.OBJECT_TYPE_PERUN_PLUGIN);
		dboSingleFormPlugin.setVal("CONTEXT_NAME", "single-form-table");
		dboSingleFormPlugin.setVal("LABEL_CODE", "perun.plugin.single_form_table");
		dboSingleFormPlugin.setVal("MENU_CONF", tableAsSingleForm());
		dboSingleFormPlugin.setVal("CONTEXT_MENU_CONF", null);
		dboSingleFormPlugin.setVal("PERMISSION_CODE", "/");
		dboSingleFormPlugin.setVal("IMG_PATH", "/");
		dboSingleFormPlugin.setVal("JAVASCRIPT_PATH", "/");
		dboSingleFormPlugin.setVal("SORT_ORDER", 1);
		dboSingleFormPlugin.setVal("VERSION", 1);
		dboSingleFormPlugin.setStatus(svCONST.STATUS_VALID);
		svw.saveObject(dboSingleFormPlugin, false);
	}
	
	private JsonObject tableAsGrid() {
		JsonObject recordObject = new JsonObject();
		recordObject.addProperty("ID", "%TABLE_NAME%_%OBJECT_ID%");
		recordObject.addProperty("label", "%LABEL_PARAMETER%");
		
		JsonObject recordConf = new JsonObject();
		recordConf.addProperty("enabled", true);
		recordConf.addProperty("readOnly", false);
		recordConf.addProperty("type", "grid");
		
		JsonObject recordFieldList = new JsonObject();
		recordFieldList.addProperty("type", "GET");
		recordFieldList.addProperty("onSubmit", "/ReactElements/getTableFieldList/%TOKEN%/%TABLE_NAME%");
		recordConf.add("configuration", recordFieldList);
		
		JsonObject recordGuiData = new JsonObject();
		recordGuiData.addProperty("type", "GET");
		recordGuiData.addProperty("onSubmit", "/ReactElements/getObjectsByParentId/%TOKEN%/%OBJECT_ID%/%TABLE_NAME%/0");
		recordConf.add("data", recordGuiData);
		
		JsonObject formConf = new JsonObject();
		formConf.addProperty("enabled", true);
		formConf.addProperty("numberOfColumns", 2);
		formConf.addProperty("type", "form");
		
		JsonObject formJsonSchema = new JsonObject();
		formJsonSchema.addProperty("type", "GET");
		formJsonSchema.addProperty("readOnly", false);
		formJsonSchema.addProperty("onSubmit", "/ReactElements/getTableJSONSchema/%TOKEN%/%TABLE_NAME%");
		formConf.add("configuration", formJsonSchema);
		
		JsonObject formFormData = new JsonObject();
		formFormData.addProperty("type", "GET");
		formFormData.addProperty("onSubmit", "/ReactElements/getTableFormData/%TOKEN%/{%TABLE_NAME%.OBJECT_ID}/%TABLE_NAME%");
		formConf.add("data", formFormData);
		
		JsonObject formUiSchema = new JsonObject();
		formUiSchema.addProperty("type", "GET");
		formUiSchema.addProperty("onSubmit", "/ReactElements/getTableUISchema/%TOKEN%/%TABLE_NAME%");
		formConf.add("uischema", formUiSchema);
		
		JsonObject recordDelete = new JsonObject();
		recordDelete.addProperty("enabled", true);
		formConf.add("delete", recordDelete);
		
		JsonObject redordSave = new JsonObject();
		redordSave.addProperty("type", "POST");
		redordSave.addProperty("onSave", "/ReactElements/createTableRecordFormData/%TOKEN%/%TABLE_NAME%/%OBJECT_ID%");
		formConf.add("save", redordSave);

		recordConf.add("form", formConf);
		
		recordObject.add("objectConfiguration", recordConf);
		return recordObject;
	}
	
	
	private JsonObject tableAsSingleForm() throws SvException {
		JsonObject recordObject = new JsonObject();
		recordObject.addProperty("ID", "%TABLE_NAME%_%OBJECT_ID%");
		recordObject.addProperty("label", "%LABEL_PARAMETER%");

		JsonObject recordConf = new JsonObject();
		recordConf.addProperty("enabled", true);
		recordConf.addProperty("readOnly", false);
		recordConf.addProperty("type", "form");

		JsonObject recordJsonSchema = new JsonObject();
		recordJsonSchema.addProperty("type", "GET");
		recordJsonSchema.addProperty("readOnly", false);
		recordJsonSchema.addProperty("onSubmit", "/ReactElements/getTableJSONSchema/%TOKEN%/%TABLE_NAME%");
		recordConf.add("configuration", recordJsonSchema);

		JsonObject recordFormData = new JsonObject();
		recordFormData.addProperty("type", "GET");
		recordFormData.addProperty("onSubmit", "/ReactElements/getTableFormData/%TOKEN%/%RECORD_ID%/%TABLE_NAME%");
		recordConf.add("data", recordFormData);

		JsonObject recordSave = new JsonObject();
		recordSave.addProperty("type", "POST");
		recordSave.addProperty("onSave", "/ReactElements/createTableRecordFormData/%TOKEN%/%TABLE_NAME%/%OBJECT_ID%");
		recordConf.add("save", recordSave);

		JsonObject animalUiSchema = new JsonObject();
		animalUiSchema.addProperty("type", "GET");
		animalUiSchema.addProperty("onSubmit", "/ReactElements/getTableUISchema/%TOKEN%/%TABLE_NAME%");
		recordConf.add("uischema", animalUiSchema);

		recordObject.add("objectConfiguration", recordConf);
		return recordObject;
	}
	

	@Override
	public int getVersion(int currentVersion) {
		return 2;
	}

	@Override
	public List<UpdateType> getUpdateTypes() {
		List<UpdateType> types = new ArrayList<UpdateType>();
		types.add(UpdateType.FINAL);
		return types;
	}

}
