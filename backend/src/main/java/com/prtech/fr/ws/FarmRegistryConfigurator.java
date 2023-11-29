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
import com.prtech.svarog.SvExecManager;
import com.prtech.svarog.SvNote;
import com.prtech.svarog.SvReader;
import com.prtech.svarog.SvWriter;
import com.prtech.svarog.svCONST;
import com.prtech.svarog_common.DbDataObject;

public class FarmRegistryConfigurator implements ISvConfigurationMulti {

	static final Logger log4j = SvConf.getLogger(FarmRegistryConfigurator.class);
	
	SvReader svr = null;
	SvWriter svw = null;
	SvExecManager svsec = null;
	SvNote svn = null;

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
		try (SvExecManager svsec1 = new SvExecManager((SvCore) core);
				SvReader svr1 = new SvReader(svsec1);
				SvWriter svw1 = new SvWriter(svsec1);
				SvNote svn1 = new SvNote(svsec1);) {
			svw = svw1;
			svr = svr1;
			svsec = svsec1;
			svn = svn1;
			svw.setAutoCommit(false);
			createExtendedMenuPlugin(svw);
			svw.dbCommit();
		}
		return null;
	}

	
	private void createExtendedMenuPlugin(SvWriter svw) throws SvException {
		DbDataObject dboPlugin = new DbDataObject(svCONST.OBJECT_TYPE_PERUN_PLUGIN);
		dboPlugin.setVal("CONTEXT_NAME", "grid-table");
		dboPlugin.setVal("LABEL_CODE", "perun.plugin.grid_table");
		dboPlugin.setVal("MENU_CONF", tableAsGrid());
		dboPlugin.setVal("CONTEXT_MENU_CONF", null);
		dboPlugin.setVal("PERMISSION_CODE", "/");
		dboPlugin.setVal("IMG_PATH", "/");
		dboPlugin.setVal("JAVASCRIPT_PATH", "/");
		dboPlugin.setVal("SORT_ORDER", 1);
		dboPlugin.setVal("VERSION", 1);
		dboPlugin.setStatus(svCONST.STATUS_VALID);
		svw.saveObject(dboPlugin, false);
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
	
	

	@Override
	public int getVersion(int currentVersion) {
		return 1;
	}

	@Override
	public List<UpdateType> getUpdateTypes() {
		List<UpdateType> types = new ArrayList<UpdateType>();
		types.add(UpdateType.FINAL);
		return types;
	}

}
