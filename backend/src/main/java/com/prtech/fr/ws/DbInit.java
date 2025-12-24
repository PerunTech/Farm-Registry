package com.prtech.fr.ws;

import java.util.ArrayList;
import java.util.Iterator;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.prtech.svarog.Sv;
import com.prtech.svarog.SvConf;
import com.prtech.svarog.svCONST;
import com.prtech.svarog_common.DbDataField;
import com.prtech.svarog_common.DbDataField.DbFieldType;

import com.prtech.svarog_common.DbDataObject;
import com.prtech.svarog_common.DbDataTable;
import com.prtech.svarog_common.IDbInit;

public class DbInit implements IDbInit {

	static final String CONST_GUI_FIL_HIDE = "{\"react\":{\"filterable\":false,\"visible\":false,\"resizable\":true,\"editable\":false}}";
	static final String CONST_GUI_FIL_READONLY = "{\"react\":{\"filterable\":true,\"visible\":true,\"resizable\":true,\"editable\":false}}";
	static final String CONST_GUI_FIL_VIS_RES_RO = "{\"react\":{\"filterable\":true,\"visible\":true,\"resizable\":true,\"editable\":false,\"uischema\":{\"ui:readonly\":true}}}";
	static final String CONST_GUI_FIL_VIS_RES_RW = "{\"react\":{\"filterable\":true,\"visible\":true,\"resizable\":true,\"editable\":true}}";
	static final String CONST_MASTER_REPO = "{MASTER_REPO}";
	static final String CONST_DEFAULT_SCHEMA = "{DEFAULT_SCHEMA}";
	static final String CONST_GUI_DROP_DOWN_FILTER = "{\"react\":{\"filterable\":true,\"visible\":true,\"resizable\":true,\"idtable\":\"{TABLE}\",\"idgetfield\":\"{COLNAME}\",\"idfield\":\"{ID_FIELD}\",\"idvalue\":\"{ID_VALUE}\"}}";

	static final String CONST_TABLE = "{TABLE}";
	static final String CONST_COLNAME = "{COLNAME}";
	static final String CONST_ID_FIELD = "{ID_FIELD}";
	static final String CONST_VALUE = "{ID_VALUE}";
	static final String CONST_FARMER = "FARMER";
	static final JsonObject jsonReactMeta = loadJsonReactMeta();

	private static JsonObject loadJsonReactMeta() {
		String reactMeta = "{   \"FARMER\": [{\"FIELD\": \"FIC\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"ID_NO\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"TAX_NO\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"FULL_NAME\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"SURNAME\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"FNAME\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"GENDER\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"DT_BIRTH\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"DT_DEATH\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"HIDDEN\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"FTYPE\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"FARM_ADDRESS\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"FARM_MUNIC\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"HIDDEN\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"FARM_MUNIC_CODE\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"FARMER_DT_INSERT\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"HIDDEN\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"FARMER_DT_DELETE\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"HIDDEN\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"ORG_FORM\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"EDUCATION\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"WORK_STATUS\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"PHONE\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"MAIL\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"ADDRESS\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"FTYPE_SOP\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"HIDDEN\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"IPARD_NO\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"HIDDEN\",\"ADDITIONAL\": null,\"CUSTOM\": null}   ],   \"HOLDING_MEMBER\": [{\"FIELD\": \"FIC\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"HIDDEN\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"OLD_FARMER_PKID\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"HIDDEN\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"FARMER_NAT_ID\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"FARMER_SURNAME\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"FARMER_NAME\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"FARMER_GENDER\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"AGRICULTURE_INVOLVMENT\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"RESPONSIBLE_FARM_PERSON\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"NO_OWN_HOLDINGS\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"HIDDEN\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"NO_MEMBERSHIPS_OTHERHOLDS\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"HIDDEN\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"NO_OWN_LEGAL_HOLDING\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"HIDDEN\",\"ADDITIONAL\": null,\"CUSTOM\": null}   ],   \"LPIS_PARCEL\": [{\"FIELD\": \"LPIS_PARCEL_ID\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"OLD_FARMER_PKID\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"HIDDEN\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"LAND_USE_ID\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"HOME_NAME\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"NOTE_INSERT\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"NOTE_FARMER\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"NOTE_ORGANISATION\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"COUNTRY\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"AREA\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"ALLOWED_AREA\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"COMMON_USE\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"CERTIFICATE_OF_USE\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null}   ],   \"CAD_PARCEL\": [{\"FIELD\": \"OLD_FARMER_PKID\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"HIDDEN\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"FIC\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"HIDDEN\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"VALID_FROM\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"VALID_TO\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"PARCEL_ID\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"NATIONAL_CODE_NAME\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"HIDDEN\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"NATIONAL_CODE\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"SHEET\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"HIDDEN\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"SUB\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"HOLDING_TYPE_CODE\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"PERC_OWNERSHIP\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"AREA\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"IS_RURAL\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"HIDDEN\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"IS_RURAL_2017\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"HIDDEN\",\"ADDITIONAL\": null,\"CUSTOM\": null}   ],   \"ANIMAL\": [{\"FIELD\": \"HOLDING_ID\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"HOLDING_LOCATION\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"HOLDING_LOCATION_ID\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"HIDDEN\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"OWNER_NAT_ID\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"OWNER_VAT_ID\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"COUNTRY_ORIGIN\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"EAR_TAG_NUMBER\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"ANIMAL_TYPE\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"ANIMAL_BIRTH_DATE\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"ANIMAL_SEX\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"ANIMAL_RACE_CODE\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RO\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"FIC\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"HIDDEN\",\"ADDITIONAL\": null,\"CUSTOM\": null}   ],   \"LAND_USE_PLAN\": [{\"FIELD\": \"CROP_CODE\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RW\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"AREA\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RW\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"NUMBER_PLANTS\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RW\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"IS_ORGANIC\",\"VISIBLEINGRID\": true,\"EDITABILITY\": \"RW\",\"ADDITIONAL\": null,\"CUSTOM\": null},{\"FIELD\": \"CAMPAIGN_YEAR\",\"VISIBLEINGRID\": false,\"EDITABILITY\": \"HIDDEN\",\"ADDITIONAL\": null,\"CUSTOM\": null}   ]}";
		Gson gs = new Gson();
		JsonObject metaJson = gs.fromJson(reactMeta, JsonObject.class);
		return metaJson;

	}

	private static DbDataTable addSortOrder(DbDataTable dbtt) {
		Integer order = 100;
		if (dbtt.getDbTableFields() != null)
			for (DbDataField dbf : dbtt.getDbTableFields()) {
				if (dbf != null && dbf.getSort_order() == null) {
					dbf.setSort_order(order);
					order = order + 100;
				}
			}
		return dbtt;
	}

	private static JsonObject addReactGuiMeta(JsonObject obj, String tableName, String fieldName) {
		JsonObject objR = new JsonObject();
		if (obj != null) {
			objR = obj;
		}
		try {
			JsonArray fieldList = jsonReactMeta.getAsJsonArray(tableName);
			Boolean visibleInGrid = false;
			String editability = "HIDDEN";
			JsonObject react = new JsonObject();
			Iterator<JsonElement> iterator = fieldList.iterator();
			while (iterator.hasNext()) {

				JsonObject currField = iterator.next().getAsJsonObject();
				if (currField.get("FIELD") != null && currField.get("FIELD").getAsString().equals(fieldName)) {
					if (currField.get("VISIBLEINGRID") != null) {
						visibleInGrid = currField.get("VISIBLEINGRID").getAsBoolean();
					}
					if (currField.get("EDITABILITY") != null) {
						editability = currField.get("EDITABILITY").getAsString();
					}
					break;
				}
			}
			if (visibleInGrid) {
				react.addProperty("filterable", true);
				react.addProperty("visible", true);
				react.addProperty("resizable", true);
				react.addProperty("editable", false);
			} else {
				react.addProperty("visible", false);

			}
			JsonObject uischema = new JsonObject();
			switch (editability) {
			case "RO":
				uischema.addProperty("ui:readonly", true);
				react.add("uischema", uischema);
				break;
			case "HIDDEN":
				uischema.addProperty("ui:widget", "hidden");
				react.add("uischema", uischema);
				break;
			default:
			}

			objR.add("react", react);
		} catch (Exception e) {
			System.out.println("no config found");
		}
		return objR;
	}

	private static JsonObject setDefaultValue(JsonObject obj, String field) {
		JsonObject subObj = new JsonObject();
		subObj.addProperty("defaultValue", field);
		obj.add("editoptions", subObj);
		return obj;
	}

	// setting basic configuration on field R.P*
	private static JsonObject getDefaultUiMeta(Boolean isReadonly, Boolean isHidden, Boolean isEditable,
			Boolean isEditrules) {
		JsonObject obj = new JsonObject();

		if (isEditable)
			obj.addProperty("editable", true);
		if (isHidden)
			obj.addProperty("hidden", true);
		if (isReadonly) {
			JsonObject subObj = new JsonObject();
			subObj.addProperty("readonly", true);
			obj.add("editoptions", subObj);
		}
		if (isEditrules) {
			JsonObject subObj = new JsonObject();
			subObj.addProperty("edithidden", true);
			subObj.addProperty("required", true);
			obj.add("editrules", subObj);
		}
		return obj;
	}

	/* za Formatoptions f.r */
	private static JsonObject getUiForm(JsonObject obj, Integer uiRow, Integer uiCol) {
		JsonObject subObj = new JsonObject();
		subObj.addProperty("rowpos", uiRow);
		subObj.addProperty("colpos", uiCol);
		obj.add("formoptions", subObj);
		return obj;
	}

	private static JsonObject getUiWidth(JsonObject obj, Integer uiWidth) {
		JsonObject objR = new JsonObject();
		if (obj != null) {
			objR = obj;
		}
		objR.addProperty("width", uiWidth);
		return objR;
	}
	
	//HOLDING_TYPE
	private static DbDataTable createHoldingType() {
		DbDataTable dbe = new DbDataTable();
		dbe.setDbTableName("HOLDING_TYPE");
		dbe.setDbRepoName(CONST_MASTER_REPO);
		dbe.setDbSchema(CONST_DEFAULT_SCHEMA);
		dbe.setIsSystemTable(false);
		dbe.setIsRepoTable(false);
		dbe.setLabel_code("master_repo.holding_type");
		dbe.setUse_cache(false);
		dbe.setIsConfigTable(true);
		dbe.setConfigColumnName("NAME");
		
		DbDataField dbe1 = new DbDataField();
		dbe1.setDbFieldName("PKID");
		dbe1.setIsPrimaryKey(true);
		dbe1.setDbFieldType(DbFieldType.NUMERIC);
		dbe1.setDbFieldSize(18);
		dbe1.setDbFieldScale(0);
		dbe1.setIsNull(false);
		dbe1.setLabel_code("holding_type.pkid");
		dbe1.setGui_metadata(CONST_GUI_FIL_HIDE);
		
		DbDataField dbe2 = new DbDataField();
		dbe2.setDbFieldName("NAME");
		dbe2.setDbFieldType(DbFieldType.NVARCHAR);
		dbe2.setDbFieldSize(50);
		dbe2.setIsUnique(true);
		dbe2.setIsNull(false);
		dbe2.setLabel_code("holding_type.name");
		dbe2.setGui_metadata(CONST_GUI_FIL_VIS_RES_RW);
		
		DbDataField dbe3 = new DbDataField();
		dbe3.setDbFieldName("MENU_CODE");
		dbe3.setDbFieldType(DbFieldType.NVARCHAR);
		dbe3.setDbFieldSize(50);
		dbe3.setDbFieldScale(0);
		dbe3.setIsNull(true);
		dbe3.setLabel_code("holding_type.menu_object_id");
		dbe3.setGui_metadata("{\"react\":{\"filterable\":true,\"visible\":true,\"resizable\":true,\"editable\":true,\"idtable\":\"SVAROG_MENU\",\"idgetfield\":\"MENU_CODE\",\"idsetfield\":\"MENU_CODE\",\"uischema\":{\"ui:readonly\":false}}}");
		
		DbDataField dbe4 = new DbDataField();
		dbe4.setDbFieldName("WORKFLOW");
		dbe4.setDbFieldType(DbFieldType.NUMERIC);
		dbe4.setDbFieldSize(18);
		dbe4.setDbFieldScale(0);
		dbe4.setIsNull(true);
		dbe4.setLabel_code("holding_type.workflow");
		
		DbDataField dbe5= new DbDataField();
		dbe5.setDbFieldName("SERVICES");
		dbe5.setDbFieldType(DbFieldType.TEXT);
		dbe5.setIsNull(true);
		dbe5.setLabel_code("holding_type.services");
		dbe5.setGui_metadata("{\"react\":{\"filterable\":true,\"visible\":true,\"resizable\":true,\"editable\":true,\"format\":false}}");
		
		DbDataField dbe6 = new DbDataField();
		dbe6.setDbFieldName("SORT_ORDER");
		dbe6.setDbFieldType(DbFieldType.NUMERIC);
		dbe6.setDbFieldSize(2);
		dbe6.setDbFieldScale(0);
		dbe6.setIsNull(true);
		dbe6.setLabel_code("holding_type.sort_order");
		dbe6.setGui_metadata("{\"react\":{\"filterable\":true,\"visible\":false,\"resizable\":true,\"editable\":true}}");
		
		DbDataField[] dbTableFields = new DbDataField[6];
		dbTableFields[0] = dbe1;
		dbTableFields[1] = dbe2;
		dbTableFields[2] = dbe3;
		dbTableFields[3] = dbe4;
		dbTableFields[4] = dbe5;
		dbTableFields[5] = dbe6;
		dbe.setDbTableFields(dbTableFields);
		return dbe;
	}

	// EEDBAR2016
	// Farmer
	private static DbDataTable createFarmer() {
		DbDataTable dbe = new DbDataTable();
		dbe.setDbTableName(CONST_FARMER);
		dbe.setDbRepoName(CONST_MASTER_REPO);
		dbe.setDbSchema(CONST_DEFAULT_SCHEMA);
		dbe.setIsSystemTable(false);
		dbe.setIsRepoTable(false);
		dbe.setLabel_code("farmer.general");
		dbe.setUse_cache(false);
		dbe.setParentName(CC.PERSON);

		// Column 1N
		DbDataField dbe1 = new DbDataField();
		dbe1.setDbFieldName("PKID");
		dbe1.setIsPrimaryKey(true);
		dbe1.setDbFieldType(DbFieldType.NUMERIC);
		dbe1.setDbFieldSize(18);
		dbe1.setDbFieldScale(0);
		dbe1.setIsNull(false);
		dbe1.setLabel_code("farmer.pkid");
		// Column 2
		DbDataField dbe2 = new DbDataField();
		dbe2.setDbFieldName("OLD_PKID");
		dbe2.setDbFieldType(DbFieldType.NUMERIC);
		dbe2.setDbFieldScale(0);
		dbe2.setDbFieldSize(18);
		dbe2.setIndexName("old_pkid");
		dbe2.setLabel_code("farmer.old_pkid");
		dbe2.setGui_metadata(addReactGuiMeta(getUiForm(getDefaultUiMeta(true, true, false, false), 7, 1), CONST_FARMER,
				dbe2.getDbFieldName()).toString());
		// Column 3
		DbDataField dbe3 = new DbDataField();
		dbe3.setDbFieldName("FIC");
		dbe3.setDbFieldType(DbFieldType.NVARCHAR);
		dbe3.setDbFieldScale(0);
		dbe3.setDbFieldSize(16);
		dbe3.setIsUnique(true);
		dbe3.setIndexName("FARMER_FIC_IDX");
		dbe3.setLabel_code("farmer.fic");
		dbe3.setGui_metadata(addReactGuiMeta(getUiWidth(getDefaultUiMeta(true, false, true, false), 76), CONST_FARMER,
				dbe3.getDbFieldName()).toString());
		// Column 4
		DbDataField dbe4 = new DbDataField();
		dbe4.setDbFieldName("ID_NO");
		dbe4.setDbFieldType(DbFieldType.NVARCHAR);
		dbe4.setDbFieldScale(0);
		dbe4.setDbFieldSize(16);
		dbe4.setIndexName("FARMER_IDNO_IDX");
		dbe4.setLabel_code("farmer.id_no");
		dbe4.setGui_metadata(addReactGuiMeta(getUiWidth(getDefaultUiMeta(true, false, true, false), 96), CONST_FARMER,
				dbe4.getDbFieldName()).toString());
		// Column 5
		DbDataField dbe5 = new DbDataField();
		dbe5.setDbFieldName("TAX_NO");
		dbe5.setDbFieldType(DbFieldType.NVARCHAR);
		dbe5.setDbFieldScale(0);
		dbe5.setDbFieldSize(20);
		dbe5.setIndexName("FARMER_TAXNO_IDX");
		dbe5.setLabel_code("farmer.tax_no");
		dbe5.setGui_metadata(addReactGuiMeta(getUiWidth(getDefaultUiMeta(true, false, true, false), 96), CONST_FARMER,
				dbe5.getDbFieldName()).toString());
		// Column 6
		DbDataField dbe6 = new DbDataField();
		dbe6.setDbFieldName("FULL_NAME");
		dbe6.setDbFieldType(DbFieldType.NVARCHAR);
		dbe6.setDbFieldScale(0);
		dbe6.setDbFieldSize(500);
		dbe6.setIndexName("full_name");
		dbe6.setLabel_code("farmer.full_name");
		dbe6.setGui_metadata(addReactGuiMeta(getUiWidth(getDefaultUiMeta(true, false, true, false), 170), CONST_FARMER,
				dbe6.getDbFieldName()).toString());
		// Column 7
		DbDataField dbe7 = new DbDataField();
		dbe7.setDbFieldName("SURNAME");
		dbe7.setDbFieldType(DbFieldType.NVARCHAR);
		dbe7.setDbFieldScale(0);
		dbe7.setDbFieldSize(150);
		dbe7.setLabel_code("farmer.surname");
		dbe7.setGui_metadata(addReactGuiMeta(getUiWidth(getDefaultUiMeta(true, false, true, false), 119), CONST_FARMER,
				dbe7.getDbFieldName()).toString());
		// Column 8
		DbDataField dbe8 = new DbDataField();
		dbe8.setDbFieldName("FNAME");
		dbe8.setDbFieldType(DbFieldType.NVARCHAR);
		dbe8.setDbFieldScale(0);
		dbe8.setDbFieldSize(150);
		dbe8.setLabel_code("farmer.fname");
		dbe8.setGui_metadata(addReactGuiMeta(getUiWidth(getDefaultUiMeta(true, false, true, false), 85), CONST_FARMER,
				dbe8.getDbFieldName()).toString());
		// Column 9
		DbDataField dbe9 = new DbDataField();
		dbe9.setDbFieldName("GENDER");
		dbe9.setDbFieldType(DbFieldType.NVARCHAR);
		dbe9.setDbFieldScale(0);
		dbe9.setDbFieldSize(20);
		dbe9.setCode_list_user_code("GENDER");
		dbe9.setLabel_code("farmer.gender");
		dbe9.setGui_metadata(addReactGuiMeta(getUiWidth(getDefaultUiMeta(false, true, true, false), 60), CONST_FARMER,
				dbe9.getDbFieldName()).toString());
		// Column 10
		DbDataField dbe10 = new DbDataField();
		dbe10.setDbFieldName("DT_BIRTH");
		dbe10.setDbFieldType(DbFieldType.TIMESTAMP);
		dbe10.setDbFieldSize(3);
		dbe10.setGui_metadata(addReactGuiMeta(getUiWidth(getDefaultUiMeta(true, false, true, false), 95), CONST_FARMER,
				dbe10.getDbFieldName()).toString());
		dbe10.setLabel_code("farmer.dt_birth");
		// Column 11
		DbDataField dbe11 = new DbDataField();
		dbe11.setDbFieldName("DT_DEATH");
		dbe11.setDbFieldType(DbFieldType.TIMESTAMP);
		dbe11.setDbFieldSize(3);
		dbe11.setGui_metadata(addReactGuiMeta(getUiForm(getDefaultUiMeta(false, true, true, false), 16, 1),
				CONST_FARMER, dbe11.getDbFieldName()).toString());
		dbe11.setLabel_code("farmer.dt_death");
		// Column 12
		DbDataField dbe12 = new DbDataField();
		dbe12.setDbFieldName("FTYPE");
		dbe12.setDbFieldType(DbFieldType.NVARCHAR);
		dbe12.setDbFieldSize(20);
		//dbe12.setCode_list_user_code("FTYPE");
		dbe12.setGui_metadata(addReactGuiMeta(getUiWidth(getDefaultUiMeta(false, false, true, false), 133),
				CONST_FARMER, dbe12.getDbFieldName()).toString());
		dbe12.setLabel_code("farmer.ftype");
		// Column 13
		DbDataField dbe13 = new DbDataField();
		dbe13.setDbFieldName("FARM_ADDRESS");
		dbe13.setDbFieldType(DbFieldType.NVARCHAR);
		dbe13.setDbFieldScale(0);
		dbe13.setDbFieldSize(100);
		dbe13.setGui_metadata(addReactGuiMeta(getUiWidth(getDefaultUiMeta(false, true, false, false), 133),
				CONST_FARMER, dbe13.getDbFieldName()).toString());
		dbe13.setLabel_code("farmer.farm_address");
		// Column 14
		DbDataField dbe14 = new DbDataField();
		dbe14.setDbFieldName("FARM_MUNIC");
		dbe14.setDbFieldType(DbFieldType.NVARCHAR);
		dbe14.setDbFieldScale(0);
		dbe14.setDbFieldSize(80);
		dbe14.setCode_list_user_code("MUNICIPALITY");
		dbe14.setGui_metadata(addReactGuiMeta(getUiWidth(getDefaultUiMeta(false, true, false, false), 133),
				CONST_FARMER, dbe14.getDbFieldName()).toString());
		dbe14.setLabel_code("farmer.farm_munic");
		// Column 15
		DbDataField dbe15 = new DbDataField();
		dbe15.setDbFieldName("FARM_MUNIC_CODE");
		dbe15.setDbFieldType(DbFieldType.NVARCHAR);
		dbe15.setDbFieldScale(0);
		dbe15.setDbFieldSize(100);
		dbe15.setCode_list_user_code("MUNICIPALITY");
		dbe15.setGui_metadata(addReactGuiMeta(getUiForm(getDefaultUiMeta(false, true, false, false), 8, 2),
				CONST_FARMER, dbe15.getDbFieldName()).toString());
		dbe15.setLabel_code("farmer.farm_munic_code");
		// Column 16
		DbDataField dbe16 = new DbDataField();
		dbe16.setDbFieldName("FARMER_DT_INSERT");
		dbe16.setDbFieldType(DbFieldType.TIMESTAMP);
		dbe16.setDbFieldSize(3);
		dbe16.setGui_metadata(addReactGuiMeta(getUiForm(getDefaultUiMeta(false, true, true, false), 9, 2), CONST_FARMER,
				dbe16.getDbFieldName()).toString());
		dbe16.setLabel_code("farmer.farmer_dt_insert");
		// Column 17
		DbDataField dbe17 = new DbDataField();
		dbe17.setDbFieldName("FARMER_DT_DELETE");
		dbe17.setDbFieldType(DbFieldType.TIMESTAMP);
		dbe17.setDbFieldSize(3);
		dbe17.setGui_metadata(addReactGuiMeta(getUiForm(getDefaultUiMeta(false, true, true, false), 10, 2),
				CONST_FARMER, dbe17.getDbFieldName()).toString());
		dbe17.setLabel_code("farmer.farmer_dt_delete");
		// Column 18
		DbDataField dbe18 = new DbDataField();
		dbe18.setDbFieldName("ORG_FORM");
		dbe18.setDbFieldType(DbFieldType.NVARCHAR);
		dbe18.setDbFieldScale(0);
		dbe18.setDbFieldSize(10);
		dbe18.setCode_list_user_code("ORG_FORM");
		dbe18.setGui_metadata(addReactGuiMeta(getUiForm(getDefaultUiMeta(false, true, true, false), 11, 2),
				CONST_FARMER, dbe18.getDbFieldName()).toString());
		dbe18.setLabel_code("farmer.org_form");
		// Column 19
		DbDataField dbe19 = new DbDataField();
		dbe19.setDbFieldName("EDUCATION");
		dbe19.setDbFieldType(DbFieldType.NVARCHAR);
		dbe19.setDbFieldScale(0);
		dbe19.setDbFieldSize(150);
		dbe19.setCode_list_user_code("EDUCATION");
		dbe19.setGui_metadata(addReactGuiMeta(getUiForm(getDefaultUiMeta(false, true, true, false), 12, 2),
				CONST_FARMER, dbe19.getDbFieldName()).toString());
		dbe19.setLabel_code("farmer.education");
		// Column 21
		DbDataField dbe20 = new DbDataField();
		dbe20.setDbFieldName("WORK_STATUS");
		dbe20.setDbFieldType(DbFieldType.NVARCHAR);
		dbe20.setDbFieldScale(0);
		dbe20.setDbFieldSize(300);
		dbe20.setCode_list_user_code("WORK_STATUS");
		dbe20.setGui_metadata(addReactGuiMeta(getUiForm(getDefaultUiMeta(false, true, true, false), 13, 2),
				CONST_FARMER, dbe20.getDbFieldName()).toString());
		dbe20.setLabel_code("farmer.work_status");
		// Column 21
		DbDataField dbe21 = new DbDataField();
		dbe21.setDbFieldName("PHONE");
		dbe21.setDbFieldType(DbFieldType.NVARCHAR);
		dbe21.setDbFieldScale(0);
		dbe21.setDbFieldSize(100);
		dbe21.setGui_metadata(addReactGuiMeta(getUiForm(getDefaultUiMeta(false, true, true, false), 14, 2),
				CONST_FARMER, dbe21.getDbFieldName()).toString());
		dbe21.setLabel_code("farmer.phone");
		// Column 22
		DbDataField dbe22 = new DbDataField();
		dbe22.setDbFieldName("MAIL");
		dbe22.setDbFieldType(DbFieldType.NVARCHAR);
		dbe22.setDbFieldScale(0);
		dbe22.setDbFieldSize(100);
		dbe22.setGui_metadata(addReactGuiMeta(getUiForm(getDefaultUiMeta(false, true, true, false), 15, 2),
				CONST_FARMER, dbe22.getDbFieldName()).toString());
		dbe22.setLabel_code("farmer.mail");
		// Column 23
		DbDataField dbe23 = new DbDataField();
		dbe23.setDbFieldName("ADDRESS");
		dbe23.setDbFieldType(DbFieldType.NVARCHAR);
		dbe23.setDbFieldScale(0);
		dbe23.setDbFieldSize(250);
		dbe23.setGui_metadata(addReactGuiMeta(getUiForm(getDefaultUiMeta(false, true, true, false), 16, 2),
				CONST_FARMER, dbe23.getDbFieldName()).toString());
		dbe23.setLabel_code("farmer.address");
		

		DbDataField[] dbTableFields = new DbDataField[23];
		dbTableFields[0] = dbe1;
		dbTableFields[1] = dbe2;
		dbTableFields[2] = dbe3;
		dbTableFields[3] = dbe4;
		dbTableFields[4] = dbe5;
		dbTableFields[5] = dbe6;
		dbTableFields[6] = dbe7;
		dbTableFields[7] = dbe8;
		dbTableFields[8] = dbe9;
		dbTableFields[9] = dbe10;
		dbTableFields[10] = dbe11;
		dbTableFields[11] = dbe12;
		dbTableFields[12] = dbe13;
		dbTableFields[13] = dbe14;
		dbTableFields[14] = dbe15;
		dbTableFields[15] = dbe16;
		dbTableFields[16] = dbe17;
		dbTableFields[17] = dbe18;
		dbTableFields[18] = dbe19;
		dbTableFields[19] = dbe20;
		dbTableFields[20] = dbe21;
		dbTableFields[21] = dbe22;
		dbTableFields[22] = dbe23;

		dbe.setDbTableFields(dbTableFields);
		return dbe;
	}

	// LAND_USE_PLAN
	private static DbDataTable createLandUsePlan() {
		DbDataTable dbe = new DbDataTable();
		dbe.setDbTableName("LAND_USE_PLAN");
		dbe.setDbRepoName(CONST_MASTER_REPO);
		dbe.setDbSchema(CONST_DEFAULT_SCHEMA);
		dbe.setIsSystemTable(false);
		dbe.setIsRepoTable(false);
		dbe.setParentName(CONST_FARMER);
		dbe.setLabel_code("land_use_plan.general");
		dbe.setUse_cache(false);
		// Column 1N
		DbDataField dbe1 = new DbDataField();
		dbe1.setDbFieldName("PKID");
		dbe1.setIsPrimaryKey(true);
		dbe1.setDbFieldType(DbFieldType.NUMERIC);
		dbe1.setDbFieldSize(18);
		dbe1.setDbFieldScale(0);
		dbe1.setIsNull(false);
		dbe1.setLabel_code("land_use_plan.pkid");
		// Column 2
		DbDataField dbe2 = new DbDataField();
		dbe2.setDbFieldName("CROP_CODE");
		dbe2.setDbFieldType(DbFieldType.NUMERIC);
		dbe2.setIsNull(false);
		dbe2.setDbFieldSize(18);
		dbe2.setDbFieldScale(0);
		dbe2.setLabel_code("land_use_plan.crop_code");
		dbe2.setIndexName("LU_PLAN_CROP_IDX");
		dbe2.setCode_list_user_code("CROP_CODE");
		dbe2.setGui_metadata(
				"{\"react\":{\"filterable\":true,\"width\":270,\"visible\":true,\"resizable\":true,\"editable\":false}}");

		// Column 3
		DbDataField dbe3 = new DbDataField();
		dbe3.setDbFieldName("NUMBER_PLANTS");
		dbe3.setDbFieldType(DbFieldType.NUMERIC);
		dbe3.setDbFieldSize(18);
		dbe3.setDbFieldScale(0);
		dbe3.setLabel_code("land_use_plan.number_plants");
		dbe3.setGui_metadata(addReactGuiMeta(getUiWidth(getDefaultUiMeta(false, false, true, false), 83),
				"LAND_USE_PLAN", dbe3.getDbFieldName()).toString());

		// Column 4
		DbDataField dbe4 = new DbDataField();
		dbe4.setDbFieldName("AREA");
		dbe4.setDbFieldType(DbFieldType.NUMERIC);
		dbe4.setDbFieldSize(18);
		dbe4.setDbFieldScale(0);
		dbe4.setIsNull(false);
		dbe4.setLabel_code("land_use_plan.area");
		dbe4.setGui_metadata(
				addReactGuiMeta(setDefaultValue(getDefaultUiMeta(false, false, true, true), "{PH_DEFAULT_AREA}"),
						"LAND_USE_PLAN", dbe4.getDbFieldName()).toString());
		// Column 5
		DbDataField dbe5 = new DbDataField();
		dbe5.setDbFieldName("IS_ORGANIC");
		dbe5.setDbFieldType(DbFieldType.BOOLEAN);
		dbe5.setIndexName("is_organic");
		dbe5.setCode_list_user_code("BOOLEAN_TRUE_FALSE");
		dbe5.setLabel_code("land_use_plan.is_organic");
		dbe5.setGui_metadata(addReactGuiMeta(null, "LAND_USE_PLAN", dbe5.getDbFieldName()).toString());
		dbe5.setGui_metadata(
				"{\"react\":{\"filterable\":true,\"visible\":true,\"resizable\":true,\"editable\":true,\"uischema\":{\"ui:widget\":\"select\"}}}");

		// Column 6
		DbDataField dbe6 = new DbDataField();
		dbe6.setDbFieldName("CAMPAIGN_YEAR");
		dbe6.setDbFieldType(DbFieldType.NVARCHAR);
		dbe6.setDbFieldScale(0);
		dbe6.setDbFieldSize(10);
		dbe6.setLabel_code("land_use_plan.campaign_year");
		dbe6.setGui_metadata(addReactGuiMeta(getUiWidth(getDefaultUiMeta(true, true, false, false), 59),
				"LAND_USE_PLAN", dbe6.getDbFieldName()).toString());

		// Column 7
		DbDataField dbe7 = new DbDataField();
		dbe7.setDbFieldName("AGRI_PARCEL_ID");
		dbe7.setDbFieldType(DbFieldType.NUMERIC);
		dbe7.setDbFieldScale(0);
		dbe7.setDbFieldSize(18);
		dbe7.setIndexName("agri_parcel_id");
		dbe7.setLabel_code("land_use_plan.agri_parcel_id");
		dbe7.setGui_metadata(
				"{\"react\":{\"filterable\":true,\"visible\":false,\"resizable\":true,\"editable\":false,\"uischema\":{\"ui:widget\":\"hidden\"}}}");

		DbDataField dbf8 = new DbDataField();
		dbf8.setDbFieldName(Sv.CENTROID);
		dbf8.setDbFieldType(DbFieldType.GEOMETRY);
		dbf8.setIsNull(true);
		dbf8.setGeometryType("POINT");
		dbf8.setGeometrySrid(SvConf.getParam("sys.gis.default_srid"));
		dbf8.setIndexName("cent_idx");
		dbf8.setLabel_code(Sv.MASTER_REPO + Sv.DOT + Sv.CENTROID.toLowerCase());
		dbf8.setGui_metadata(
				"{\"react\":{\"filterable\":true,\"visible\":false,\"resizable\":true,\"editable\":false,\"uischema\":{\"ui:widget\":\"hidden\"}}}");

		// Column 9
		DbDataField dbf9 = new DbDataField();
		dbf9.setDbFieldName("GEOM");
		dbf9.setDbFieldType(DbFieldType.GEOMETRY);
		dbf9.setIsNull(true);
		dbf9.setGeometryType("POLYGON");
		dbf9.setGeometrySrid(SvConf.getParam("sys.gis.default_srid"));
		dbf9.setIndexName("geom_idx");
		dbf9.setLabel_code(Sv.MASTER_REPO + Sv.DOT + Sv.GEOMETRY.toLowerCase());
		dbf9.setGui_metadata(
				"{\"react\":{\"filterable\":true,\"visible\":false,\"resizable\":true,\"editable\":false,\"uischema\":{\"ui:widget\":\"hidden\"}}}");

		DbDataField[] dbTableFields = new DbDataField[9];
		dbTableFields[0] = dbe1;
		dbTableFields[1] = dbe2;
		dbTableFields[2] = dbe4;
		dbTableFields[3] = dbe3;
		dbTableFields[4] = dbe5;
		dbTableFields[5] = dbe6;
		dbTableFields[6] = dbe7;
		dbTableFields[7] = dbf8;
		dbTableFields[8] = dbf9;
		dbe.setDbTableFields(dbTableFields);
		return dbe;
	}

	// FARMER
	private static DbDataTable createFarm() {
		DbDataTable dbe = new DbDataTable();
		dbe.setDbTableName("farm");
		dbe.setDbRepoName("{MASTER_REPO}");
		dbe.setDbSchema("{DEFAULT_SCHEMA}");
		dbe.setIsSystemTable(false);
		dbe.setIsRepoTable(false);
		dbe.setLabel_code("master_repo.fr_farmer");
		dbe.setUse_cache(false);
		dbe.setParentName("PERSON");

		DbDataField dbe1 = new DbDataField();
		dbe1.setDbFieldName("PKID");
		dbe1.setIsPrimaryKey(true);
		dbe1.setDbFieldType(DbFieldType.NUMERIC);
		dbe1.setDbFieldSize(18);
		dbe1.setDbFieldScale(0);
		dbe1.setIsNull(false);
		dbe1.setLabel_code("farm.pkid");

		DbDataField dbe2 = new DbDataField();
		dbe2.setDbFieldName("META_PKID_OLD");
		dbe2.setDbFieldType(DbFieldType.NUMERIC);
		dbe2.setDbFieldSize(18);
		dbe2.setDbFieldScale(0);
		dbe2.setIsNull(true);
		dbe2.setLabel_code("farm.meta_pkid_old");

		DbDataField dbe3 = new DbDataField();
		dbe3.setDbFieldName("FIC");
		dbe3.setDbFieldType(DbFieldType.NVARCHAR);
		dbe3.setDbFieldSize(16);
		dbe3.setIsUnique(true);
		dbe3.setIsNull(true);
		dbe3.setUnique_level("TABLE");
		dbe3.setIndexName("FARM_FIC_IDX");
		dbe3.setLabel_code("farm.fic");
		dbe3.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 4
		DbDataField dbe4 = new DbDataField();
		dbe4.setDbFieldName("ARCHIVE_NUMBER");
		dbe4.setDbFieldType(DbFieldType.NUMERIC);
		dbe4.setDbFieldSize(18);
		dbe4.setIsNull(true);
		dbe4.setLabel_code("farm.archive_number");
		dbe4.setGui_metadata(CONST_GUI_FIL_HIDE);

		// Column 5
		DbDataField dbe5 = new DbDataField();
		dbe5.setDbFieldName("DT_ARRIVAL");
		dbe5.setDbFieldType(DbFieldType.DATE);
		dbe5.setDbFieldSize(3);
		dbe5.setIsNull(true);
		dbe5.setLabel_code("farm.dt_arrival");

		// Column 6
		DbDataField dbe6 = new DbDataField();
		dbe6.setDbFieldName("PERSON_OBJECT_ID");
		dbe6.setDbFieldType(DbFieldType.NUMERIC);
		dbe6.setDbFieldSize(18);
		dbe6.setDbFieldScale(0);
		dbe6.setLabel_code("farm.person_object_id");
		dbe6.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 7
		DbDataField dbe7 = new DbDataField();
		dbe7.setDbFieldName("FARM_TYPE");
		dbe7.setDbFieldType(DbFieldType.NUMERIC);
		dbe7.setDbFieldSize(18);
		dbe7.setDbFieldScale(0);
		dbe7.setLabel_code("farm.farm_type");
		dbe7.setGui_metadata(CONST_GUI_DROP_DOWN_FILTER.replace(CONST_TABLE, "APPLICANT_TYPE")
				.replace(CONST_COLNAME, "NAME").replace(CONST_ID_FIELD, "IS_FARM").replace(CONST_VALUE, "Y"));

		// Column 8
		DbDataField dbe8 = new DbDataField();
		dbe8.setDbFieldName("ORGANIC");
		dbe8.setDbFieldType(DbFieldType.NVARCHAR);
		dbe8.setDbFieldSize(20);
		dbe8.setLabel_code("farm.organic");
		dbe8.setIsNull(true);
		dbe8.setCode_list_user_code("ORGANIC");
		dbe8.setGui_metadata(CONST_GUI_FIL_VIS_RES_RW);

		// Column 9
		DbDataField dbe9 = new DbDataField();
		dbe9.setDbFieldName("FARM_MEMBERS");
		dbe9.setDbFieldType(DbFieldType.NUMERIC);
		dbe9.setDbFieldSize(5);
		dbe9.setDbFieldScale(0);
		dbe9.setLabel_code("farm.farm_members");
		dbe9.setIsNull(true);
		dbe9.setGui_metadata(CONST_GUI_FIL_VIS_RES_RW);

		// Column 9
		DbDataField dbe10 = new DbDataField();
		dbe10.setDbFieldName("FULL_NAME");
		dbe10.setDbFieldType(DbFieldType.NVARCHAR);
		dbe10.setDbFieldSize(255);
		dbe10.setLabel_code("farm.full_name");
		dbe10.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 10
		DbDataField dbe11 = new DbDataField();
		dbe11.setDbFieldName("OFFICIAL_CONTACT_OBJ_ID");
		dbe11.setDbFieldType(DbFieldType.NUMERIC);
		dbe11.setDbFieldSize(18);
		dbe11.setDbFieldScale(0);
		dbe11.setLabel_code("farm.official_contact_obj_id");
		dbe11.setGui_metadata(CONST_GUI_FIL_HIDE);
		
		// Column 25
		DbDataField dbe25 = new DbDataField();
		dbe25.setDbFieldName("NOTE");
		dbe25.setDbFieldType(DbFieldType.NVARCHAR);
		dbe25.setDbFieldSize(2000);
		dbe25.setLabel_code("farm.note");
		dbe25.setIsNull(true);
		dbe25.setSort_order(2500);
		dbe25.setGui_metadata(CONST_GUI_FIL_VIS_RES_RW);

		// DbDataField dbe4 = new DbDataField();
		// dbe4.setDbFieldName("LIVESTOCK_STATUS");
		// dbe4.setDbFieldType(DbFieldType.NVARCHAR);
		// dbe4.setDbFieldSize(20);
		// dbe4.setLabel_code("farm.livestock_status");
		// dbe4.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);
		//
		// DbDataField dbe5 = new DbDataField();
		// dbe5.setDbFieldName("PARCEL_AND_PLANTS_STATUS");
		// dbe5.setDbFieldType(DbFieldType.NVARCHAR);
		// dbe5.setDbFieldSize(20);
		// dbe5.setLabel_code("farm.parcel_and_plants_status");
		// dbe5.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// DbDataField dbe11 = new DbDataField();
		// dbe11.setDbFieldName("CERTIFICATION_OBJ_ID");
		// dbe11.setDbFieldType(DbFieldType.NUMERIC);
		// dbe11.setDbFieldSize(16);
		// dbe11.setLabel_code("farm.certification_obj_id");
		// dbe11.setIsNull(true);
		// dbe11.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// DbDataField dbe12 = new DbDataField();
		// dbe12.setDbFieldName("DOCUMENT_STATUS");
		// dbe12.setDbFieldType(DbFieldType.NVARCHAR);
		// dbe12.setDbFieldSize(20);
		// dbe12.setLabel_code("farm.document_status");
		// dbe12.setIsNull(true);
		// dbe12.setGui_metadata(CONST_GUI_FIL_VIS_RES_RW);
		//
		// DbDataField dbe13 = new DbDataField();
		// dbe13.setDbFieldName("FARM_HOLDER_STATUS");
		// dbe13.setDbFieldType(DbFieldType.NVARCHAR);
		// dbe13.setDbFieldSize(20);
		// dbe13.setLabel_code("farm.farm_holder_status");
		// dbe13.setIsNull(true);
		// dbe13.setGui_metadata(CONST_GUI_FIL_VIS_RES_RW);

		// DbDataField dbe14 = new DbDataField();
		// dbe14.setDbFieldName("bank_acc_obj_id");
		// dbe14.setDbFieldType(DbFieldType.NUMERIC);
		// dbe14.setDbFieldSize(10);
		// dbe14.setLabel_code("farm.bank_acc_obj_id");
		// dbe14.setIsNull(true);
		// dbe14.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		DbDataField[] dbTableFields = new DbDataField[12];
		dbTableFields[0] = dbe1;
		dbTableFields[1] = dbe2;
		dbTableFields[2] = dbe3;
		dbTableFields[3] = dbe4;
		dbTableFields[4] = dbe5;
		dbTableFields[5] = dbe6;
		dbTableFields[6] = dbe7;
		dbTableFields[7] = dbe8;
		dbTableFields[8] = dbe9;
		dbTableFields[9] = dbe10;
		dbTableFields[10] = dbe11;
		dbTableFields[11] = dbe25;

		dbe.setDbTableFields(dbTableFields);
		return dbe;
	}

	private static DbDataTable createFarmMembers() {
		DbDataTable dbe = new DbDataTable();
		dbe.setDbTableName("farm_members");
		dbe.setDbRepoName("{MASTER_REPO}");
		dbe.setDbSchema("{DEFAULT_SCHEMA}");
		dbe.setIsSystemTable(false);
		dbe.setIsRepoTable(false);
		dbe.setLabel_code("master_repo.farm_members");
		dbe.setUse_cache(false);
		dbe.setParentName("FARM");

		DbDataField dbe1 = new DbDataField();
		dbe1.setDbFieldName("PKID");
		dbe1.setIsPrimaryKey(true);
		dbe1.setDbFieldType(DbFieldType.NUMERIC);
		dbe1.setDbFieldSize(18);
		dbe1.setDbFieldScale(0);
		dbe1.setIsNull(false);
		dbe1.setLabel_code("farm_members.pkid");

		// Column 2
		DbDataField dbe2 = new DbDataField();
		dbe2.setDbFieldName("PERSON_OBJECT_ID");
		dbe2.setDbFieldType(DbFieldType.NUMERIC);
		dbe2.setDbFieldSize(18);
		dbe2.setDbFieldScale(0);
		dbe2.setLabel_code("farm_members.person_object_id");
		dbe2.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		DbDataField dbe3 = new DbDataField();
		dbe3.setDbFieldName("FULL_NAME");
		dbe3.setDbFieldType(DbFieldType.NVARCHAR);
		dbe3.setDbFieldSize(255);
		dbe3.setLabel_code("farm.full_name");
		dbe3.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		DbDataField dbe4 = new DbDataField();
		dbe4.setDbFieldName("WORK");
		dbe4.setDbFieldType(DbFieldType.NVARCHAR);
		dbe4.setDbFieldSize(100);
		dbe4.setIsNull(true);
		dbe4.setLabel_code("farm_members.work");

		DbDataField dbe5 = new DbDataField();
		dbe5.setDbFieldName("EDUCATION");
		dbe5.setDbFieldType(DbFieldType.NVARCHAR);
		dbe5.setDbFieldSize(100);
		dbe5.setIsNull(true);
		dbe5.setLabel_code("farm_members.education");

		DbDataField dbe6 = new DbDataField();
		dbe6.setDbFieldName("FARM_HOLDING_STATUS");
		dbe6.setDbFieldType(DbFieldType.BOOLEAN);
		dbe6.setIsNull(true);
		dbe6.setLabel_code("farm_members.farm_holding_status");
		// dbe10.setGui_metadata("");
		
		DbDataField dbe7 = new DbDataField();
		dbe7.setDbFieldName("DIPLOMA_NUMBER");
		dbe7.setDbFieldType(DbFieldType.NVARCHAR);
		dbe7.setDbFieldSize(18);
		dbe7.setIsNull(true);
		dbe7.setLabel_code("farm_member.diploma_number");
		dbe7.setGui_metadata(CONST_GUI_FIL_VIS_RES_RW);

		DbDataField[] dbTableFields = new DbDataField[7];
		dbTableFields[0] = dbe1;
		dbTableFields[1] = dbe2;
		dbTableFields[2] = dbe3;
		dbTableFields[3] = dbe4;
		dbTableFields[4] = dbe5;
		dbTableFields[5] = dbe6;
		dbTableFields[6] = dbe7;

		dbe.setDbTableFields(dbTableFields);
		return dbe;
	}

	private static DbDataTable createCertificationInfo() {
		DbDataTable dbe = new DbDataTable();
		dbe.setDbTableName("certifications");
		dbe.setDbRepoName("{MASTER_REPO}");
		dbe.setDbSchema("{DEFAULT_SCHEMA}");
		dbe.setIsSystemTable(false);
		dbe.setIsRepoTable(false);
		dbe.setLabel_code("master_repo.certifications");
		dbe.setUse_cache(false);

		DbDataField dbe1 = new DbDataField();
		dbe1.setDbFieldName("PKID");
		dbe1.setIsPrimaryKey(true);
		dbe1.setDbFieldType(DbFieldType.NUMERIC);
		dbe1.setDbFieldSize(18);
		dbe1.setDbFieldScale(0);
		dbe1.setIsNull(false);
		dbe1.setLabel_code("certifications.pkid");

		DbDataField dbe2 = new DbDataField();
		dbe2.setDbFieldName("VALID_FROM");
		dbe2.setDbFieldType(DbFieldType.DATE);
		dbe2.setLabel_code("certifications.valid_from");
		dbe2.setIsNull(true);
		dbe2.setGui_metadata(CONST_GUI_FIL_VIS_RES_RW);

		DbDataField dbe3 = new DbDataField();
		dbe3.setDbFieldName("VALID_TO");
		dbe3.setDbFieldType(DbFieldType.DATE);
		dbe3.setLabel_code("certifications.valid_to");
		dbe3.setIsNull(true);
		dbe3.setGui_metadata(CONST_GUI_FIL_VIS_RES_RW);

		DbDataField[] dbTableFields = new DbDataField[3];
		dbTableFields[0] = dbe1;
		dbTableFields[1] = dbe2;
		dbTableFields[2] = dbe3;

		dbe.setDbTableFields(dbTableFields);
		return dbe;
	}


	// TO DO ANIMAL FR
	

	// ANIMAL_TYPE taken from  iacs.edbar_executors /  com.prtech.svarog_custom_afsard_dp;
	private static DbDataTable createAnimalType() {
		DbDataTable dbe = new DbDataTable();
		dbe.setDbTableName("ANIMAL_TYPE");
		dbe.setDbRepoName(CONST_MASTER_REPO);
		dbe.setDbSchema(CONST_DEFAULT_SCHEMA);
		dbe.setIsSystemTable(false);
		dbe.setIsRepoTable(false);
		dbe.setConfigColumnName("LABEL_CODE");
		dbe.setIsConfigTable(true);
		dbe.setLabel_code("animal_type.general");
		dbe.setUse_cache(false);
		// Column 1N
		DbDataField dbe1 = new DbDataField();
		dbe1.setDbFieldName("PKID");
		dbe1.setIsPrimaryKey(true);
		dbe1.setDbFieldType(DbFieldType.NUMERIC);
		dbe1.setDbFieldSize(18);
		dbe1.setDbFieldScale(0);
		dbe1.setIsNull(false);
		dbe1.setSort_order(100);
		dbe1.setLabel_code("animal_type.pkid");
		// Column 2
		DbDataField dbe2 = new DbDataField();
		dbe2.setDbFieldName("CODE");
		dbe2.setDbFieldType(DbFieldType.NVARCHAR);
		dbe2.setDbFieldScale(0);
		dbe2.setDbFieldSize(20);
		dbe2.setIsNull(false);
		dbe2.setIndexName("ANIMTYPE_CODE_IDX");
		dbe2.setSort_order(200);
		dbe2.setLabel_code("animal_type.code");
		dbe2.setGui_metadata(CONST_GUI_FIL_VIS_RES_RW);
		// Column 3
		DbDataField dbe3 = new DbDataField();
		dbe3.setDbFieldName("SUBCODE");
		dbe3.setDbFieldType(DbFieldType.NVARCHAR);
		dbe3.setDbFieldScale(0);
		dbe3.setDbFieldSize(20);
		dbe3.setIsNull(false);
		dbe3.setSort_order(300);
		dbe3.setLabel_code("animal_type.subcode");
		dbe3.setGui_metadata(CONST_GUI_FIL_VIS_RES_RW);
		// Column 4
		DbDataField dbe4 = new DbDataField();
		dbe4.setDbFieldName("EXTERNAL_CODE");
		dbe4.setDbFieldType(DbFieldType.NVARCHAR);
		dbe4.setDbFieldScale(0);
		dbe4.setDbFieldSize(20);
		dbe4.setIsNull(true);
		dbe4.setSort_order(400);
		dbe4.setLabel_code("animal_type.external_code");
		dbe4.setGui_metadata(CONST_GUI_FIL_VIS_RES_RW);
		// Column 5
		DbDataField dbe5 = new DbDataField();
		dbe5.setDbFieldName("DESCRIPTION");
		dbe5.setDbFieldType(DbFieldType.NVARCHAR);
		dbe5.setDbFieldScale(0);
		dbe5.setDbFieldSize(200);
		dbe5.setIsNull(false);
		dbe5.setSort_order(500);
		dbe5.setLabel_code("animal_type.description");
		dbe5.setGui_metadata(CONST_GUI_FIL_VIS_RES_RW);
		// Column 6
		DbDataField dbe6 = new DbDataField();
		dbe6.setDbFieldName("DESCRIPTION_S");
		dbe6.setDbFieldType(DbFieldType.NVARCHAR);
		dbe6.setDbFieldScale(0);
		dbe6.setDbFieldSize(100);
		dbe6.setIsNull(true);
		dbe6.setSort_order(600);
		dbe6.setLabel_code("animal_type.description_s");
		dbe6.setGui_metadata(CONST_GUI_FIL_VIS_RES_RW);
		// Column 7
		DbDataField dbe7 = new DbDataField();
		dbe7.setDbFieldName("CATEGORY_OLD_CODE");
		dbe7.setDbFieldType(DbFieldType.NVARCHAR);
		dbe7.setDbFieldScale(0);
		dbe7.setDbFieldSize(20);
		dbe7.setIsNull(true);
		dbe7.setSort_order(700);
		dbe7.setLabel_code("animal_type.cat_old_code");
		dbe7.setGui_metadata(CONST_GUI_FIL_VIS_RES_RW);
		// Column 8
		DbDataField dbe8 = new DbDataField();
		dbe8.setDbFieldName("CATEGORY_DESCR");
		dbe8.setDbFieldType(DbFieldType.NVARCHAR);
		dbe8.setDbFieldScale(0);
		dbe8.setDbFieldSize(100);
		dbe8.setIsNull(false);
		dbe8.setSort_order(800);
		dbe8.setLabel_code("animal_type.cat_old_descr");
		dbe8.setGui_metadata(CONST_GUI_FIL_VIS_RES_RW);
		// Column 9
		DbDataField dbe9 = new DbDataField();
		dbe9.setDbFieldName("LABEL_CODE");
		dbe9.setDbFieldType(DbFieldType.NVARCHAR);
		dbe9.setDbFieldScale(0);
		dbe9.setDbFieldSize(50);
		dbe9.setIsUnique(true);
		dbe9.setIsNull(false);
		dbe9.setSort_order(900);
		dbe9.setLabel_code("mnemonic.label_code");
		dbe9.setGui_metadata(CONST_GUI_FIL_VIS_RES_RW);
		
		DbDataField[] dbTableFields = new DbDataField[9];
		dbTableFields[0] = dbe1;
		dbTableFields[1] = dbe2;
		dbTableFields[2] = dbe3;
		dbTableFields[3] = dbe4;
		dbTableFields[4] = dbe5;
		dbTableFields[5] = dbe6;
		dbTableFields[6] = dbe7;
		dbTableFields[7] = dbe8;
		dbTableFields[8] = dbe9;
		dbe.setDbTableFields(dbTableFields);
		return dbe;
	}


	// ANIMAL
	private static DbDataTable createAhvSingleAnimal() {
		DbDataTable dbe = new DbDataTable();
		dbe.setDbTableName("AHV_SINGLE_ANIMAL");
		dbe.setDbRepoName(CONST_MASTER_REPO);
		dbe.setDbSchema(CONST_DEFAULT_SCHEMA);
		dbe.setIsSystemTable(false);
		dbe.setIsRepoTable(false);
		dbe.setLabel_code("ahv_single_animal.general");
		dbe.setUse_cache(false);
		dbe.setParentName("AHV_HOLDING");

		// Column 1
		DbDataField dbe1 = new DbDataField();
		dbe1.setDbFieldName("PKID");
		dbe1.setIsPrimaryKey(true);
		dbe1.setDbFieldType(DbFieldType.NUMERIC);
		dbe1.setDbFieldSize(18);
		dbe1.setDbFieldScale(0);
		dbe1.setIsNull(false);
		dbe1.setLabel_code("ahv_single_animal.pkid");

		// Column 2
		DbDataField dbe2 = new DbDataField();
		dbe2.setDbFieldName("HOLDING_ID");
		dbe2.setDbFieldType(DbFieldType.NUMERIC);
		dbe2.setDbFieldScale(0);
		dbe2.setDbFieldSize(18);
		dbe2.setIndexName("AHV_SA_HOLDING_IDX");
		dbe2.setLabel_code("ahv_single_animal.holding_id");
		dbe2.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 3
		DbDataField dbe3 = new DbDataField();
		dbe3.setDbFieldName("COUNTRY_ORIGIN");
		dbe3.setDbFieldType(DbFieldType.NVARCHAR);
		dbe3.setDbFieldScale(0);
		dbe3.setDbFieldSize(4);
		dbe3.setCode_list_user_code("ANIMAL_ORIGIN");
		dbe3.setLabel_code("ahv_single_animal.animal_origin");
		dbe3.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 4
		DbDataField dbe4 = new DbDataField();
		dbe4.setDbFieldName("EAR_TAG_IMPORT");
		dbe4.setDbFieldType(DbFieldType.NVARCHAR);
		dbe4.setDbFieldScale(0);
		dbe4.setDbFieldSize(20);
		dbe4.setLabel_code("ahv_single_animal.ear_tag_import");
		dbe4.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 5
		DbDataField dbe5 = new DbDataField();
		dbe5.setDbFieldName("EAR_TAG_MOTHER");
		dbe5.setDbFieldType(DbFieldType.NVARCHAR);
		dbe5.setDbFieldScale(0);
		dbe5.setDbFieldSize(20);
		dbe5.setLabel_code("ahv_single_animal.ear_tag_mother");
		dbe5.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 6
		DbDataField dbe6 = new DbDataField();
		dbe6.setDbFieldName("EAR_TAG_NUMBER");
		dbe6.setDbFieldType(DbFieldType.NVARCHAR);
		dbe6.setDbFieldScale(0);
		dbe6.setDbFieldSize(20);
		dbe6.setIndexName("ANIMAL_ID_IDX");
		dbe6.setLabel_code("ahv_single_animal.ear_tag_number");
		dbe6.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 7
		DbDataField dbe7 = new DbDataField();
		dbe7.setDbFieldName("ANIMAL_TYPE");
		dbe7.setDbFieldType(DbFieldType.NVARCHAR);
		dbe7.setDbFieldScale(0);
		dbe7.setDbFieldSize(50);
		// dbe7.setCode_list_user_code("AHV_ANIMAL_TYPE");
		dbe7.setLabel_code("ahv_single_animal.animal_type");
		dbe7.setGui_metadata(
				"{\"editoptions\":{\"readonly\":true},\"width\":94,\"react\":{\"filterable\":true,\"width\":65,\"visible\":true,\"resizable\":true,\"editable\":false,\"idtable\":\"ANIMAL_TYPE\",\"idgetfield\":\"CATEGORY_DESCR\",\"idsetfield\":\"CODE\",\"uischema\":{\"ui:readonly\":true}}}");

		// Column 8
		DbDataField dbe8 = new DbDataField();
		dbe8.setDbFieldName("ANIMAL_BIRTH_DATE");
		dbe8.setDbFieldType(DbFieldType.DATE);
		dbe8.setDbFieldScale(0);
		dbe8.setDbFieldSize(10);
		dbe8.setLabel_code("ahv_single_animal.animal_birth_date");
		dbe8.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 9
		DbDataField dbe9 = new DbDataField();
		dbe9.setDbFieldName("ANIMAL_SEX");
		dbe9.setDbFieldType(DbFieldType.NVARCHAR);
		dbe9.setDbFieldScale(0);
		dbe9.setDbFieldSize(20);
		dbe9.setCode_list_user_code("GENDER");
		dbe9.setLabel_code("ahv_single_animal.animal_sex");
		dbe9.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 10
		DbDataField dbe10 = new DbDataField();
		dbe10.setDbFieldName("ANIMAL_RACE");
		dbe10.setDbFieldType(DbFieldType.NUMERIC);
		dbe10.setDbFieldScale(0);
		dbe10.setDbFieldSize(10);
		// dbe10.setCode_list_user_code("RACE_CODE");
		dbe10.setLabel_code("ahv_single_animal.animal_race");
		dbe10.setGui_metadata(
				"{\"editoptions\":{\"readonly\":true},\"width\":155,\"react\":{\"filterable\":true,\"width\":160,\"visible\":true,\"resizable\":true,\"editable\":false,\"idtable\":\"ANIMAL_TYPE\",\"idgetfield\":\"DESCRIPTION\",\"idsetfield\":\"SUBCODE\",\"uischema\":{\"ui:readonly\":true}}}");

		// Column 21
		DbDataField dbe11 = new DbDataField();
		dbe11.setDbFieldName("UPDATED_ON");
		dbe11.setDbFieldType(DbFieldType.DATE);
		dbe11.setDbFieldScale(3);
		dbe11.setLabel_code("ahv_single_animal.updated_on");
		dbe11.setIsNull(true);
		dbe11.setGui_metadata(CONST_GUI_FIL_VIS_RES_RW);

		DbDataField[] dbTableFields = new DbDataField[11];
		dbTableFields[0] = dbe1;
		dbTableFields[1] = dbe2;
		dbTableFields[2] = dbe3;
		dbTableFields[3] = dbe4;
		dbTableFields[4] = dbe5;
		dbTableFields[5] = dbe6;
		dbTableFields[6] = dbe7;
		dbTableFields[7] = dbe8;
		dbTableFields[8] = dbe9;
		dbTableFields[9] = dbe10;
		dbTableFields[10] = dbe11;

		dbe.setDbTableFields(dbTableFields);
		return dbe;
	}

	
	// ANIMAL
	private static DbDataTable createAhvSingleAnimalAutochton() {
		DbDataTable dbe = new DbDataTable();
		dbe.setDbTableName("AHV_SINGLE_ANIMAL_AUTO");
		dbe.setDbRepoName(CONST_MASTER_REPO);
		dbe.setDbSchema(CONST_DEFAULT_SCHEMA);
		dbe.setIsSystemTable(false);
		dbe.setIsRepoTable(false);
		dbe.setLabel_code("ahv_single_animal.general");
		dbe.setUse_cache(false);
		dbe.setParentName("AHV_HOLDING");

		// Column 1
		DbDataField dbe1 = new DbDataField();
		dbe1.setDbFieldName("PKID");
		dbe1.setIsPrimaryKey(true);
		dbe1.setDbFieldType(DbFieldType.NUMERIC);
		dbe1.setDbFieldSize(18);
		dbe1.setDbFieldScale(0);
		dbe1.setIsNull(false);
		dbe1.setLabel_code("ahv_single_animal.pkid");

		// Column 2
		DbDataField dbe2 = new DbDataField();
		dbe2.setDbFieldName("HOLDING_ID");
		dbe2.setDbFieldType(DbFieldType.NUMERIC);
		dbe2.setDbFieldScale(0);
		dbe2.setDbFieldSize(18);
		dbe2.setIndexName("AHV_SA_HOLDING_IDX");
		dbe2.setLabel_code("ahv_single_animal.holding_id");
		dbe2.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 3
		DbDataField dbe3 = new DbDataField();
		dbe3.setDbFieldName("COUNTRY_ORIGIN");
		dbe3.setDbFieldType(DbFieldType.NVARCHAR);
		dbe3.setDbFieldScale(0);
		dbe3.setDbFieldSize(4);
		dbe3.setCode_list_user_code("ANIMAL_ORIGIN");
		dbe3.setLabel_code("ahv_single_animal.animal_origin");
		dbe3.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 4
		DbDataField dbe4 = new DbDataField();
		dbe4.setDbFieldName("EAR_TAG_IMPORT");
		dbe4.setDbFieldType(DbFieldType.NVARCHAR);
		dbe4.setDbFieldScale(0);
		dbe4.setDbFieldSize(20);
		dbe4.setLabel_code("ahv_single_animal.ear_tag_import");
		dbe4.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 5
		DbDataField dbe5 = new DbDataField();
		dbe5.setDbFieldName("EAR_TAG_MOTHER");
		dbe5.setDbFieldType(DbFieldType.NVARCHAR);
		dbe5.setDbFieldScale(0);
		dbe5.setDbFieldSize(20);
		dbe5.setLabel_code("ahv_single_animal.ear_tag_mother");
		dbe5.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 6
		DbDataField dbe6 = new DbDataField();
		dbe6.setDbFieldName("EAR_TAG_NUMBER");
		dbe6.setDbFieldType(DbFieldType.NVARCHAR);
		dbe6.setDbFieldScale(0);
		dbe6.setDbFieldSize(20);
		dbe6.setIndexName("ANIMAL_ID_IDX");
		dbe6.setLabel_code("ahv_single_animal.ear_tag_number");
		dbe6.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 7
		DbDataField dbe7 = new DbDataField();
		dbe7.setDbFieldName("ANIMAL_TYPE");
		dbe7.setDbFieldType(DbFieldType.NVARCHAR);
		dbe7.setDbFieldScale(0);
		dbe7.setDbFieldSize(50);
		// dbe7.setCode_list_user_code("AHV_ANIMAL_TYPE");
		dbe7.setLabel_code("ahv_single_animal.animal_type");
		dbe7.setGui_metadata(
				"{\"editoptions\":{\"readonly\":true},\"width\":94,\"react\":{\"filterable\":true,\"width\":65,\"visible\":true,\"resizable\":true,\"editable\":false,\"idtable\":\"ANIMAL_TYPE\",\"idgetfield\":\"CATEGORY_DESCR\",\"idsetfield\":\"CODE\",\"uischema\":{\"ui:readonly\":true}}}");

		// Column 8
		DbDataField dbe8 = new DbDataField();
		dbe8.setDbFieldName("ANIMAL_BIRTH_DATE");
		dbe8.setDbFieldType(DbFieldType.DATE);
		dbe8.setDbFieldScale(0);
		dbe8.setDbFieldSize(10);
		dbe8.setLabel_code("ahv_single_animal.animal_birth_date");
		dbe8.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 9
		DbDataField dbe9 = new DbDataField();
		dbe9.setDbFieldName("ANIMAL_SEX");
		dbe9.setDbFieldType(DbFieldType.NVARCHAR);
		dbe9.setDbFieldScale(0);
		dbe9.setDbFieldSize(20);
		dbe9.setCode_list_user_code("GENDER");
		dbe9.setLabel_code("ahv_single_animal.animal_sex");
		dbe9.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 10
		DbDataField dbe10 = new DbDataField();
		dbe10.setDbFieldName("ANIMAL_RACE");
		dbe10.setDbFieldType(DbFieldType.NUMERIC);
		dbe10.setDbFieldScale(0);
		dbe10.setDbFieldSize(10);
		// dbe10.setCode_list_user_code("RACE_CODE");
		dbe10.setLabel_code("ahv_single_animal.animal_race");
		dbe10.setGui_metadata(
				"{\"editoptions\":{\"readonly\":true},\"width\":155,\"react\":{\"filterable\":true,\"width\":160,\"visible\":true,\"resizable\":true,\"editable\":false,\"idtable\":\"ANIMAL_TYPE\",\"idgetfield\":\"DESCRIPTION\",\"idsetfield\":\"SUBCODE\",\"uischema\":{\"ui:readonly\":true}}}");

		// Column 21
		DbDataField dbe11 = new DbDataField();
		dbe11.setDbFieldName("UPDATED_ON");
		dbe11.setDbFieldType(DbFieldType.DATE);
		dbe11.setDbFieldScale(3);
		dbe11.setLabel_code("ahv_single_animal.updated_on");
		dbe11.setIsNull(true);
		dbe11.setGui_metadata(CONST_GUI_FIL_VIS_RES_RW);

		DbDataField[] dbTableFields = new DbDataField[11];
		dbTableFields[0] = dbe1;
		dbTableFields[1] = dbe2;
		dbTableFields[2] = dbe3;
		dbTableFields[3] = dbe4;
		dbTableFields[4] = dbe5;
		dbTableFields[5] = dbe6;
		dbTableFields[6] = dbe7;
		dbTableFields[7] = dbe8;
		dbTableFields[8] = dbe9;
		dbTableFields[9] = dbe10;
		dbTableFields[10] = dbe11;

		dbe.setDbTableFields(dbTableFields);
		return dbe;
	}
	
	private static DbDataTable createAhvAnimalGroup() {
		DbDataTable dbe = new DbDataTable();
		dbe.setDbTableName("AHV_ANIMAL_GROUP");
		dbe.setDbRepoName(CONST_MASTER_REPO);
		dbe.setDbSchema(CONST_DEFAULT_SCHEMA);
		dbe.setIsSystemTable(false);
		dbe.setIsRepoTable(false);
		dbe.setLabel_code("ahv_animal_group.general");
		dbe.setUse_cache(false);
		dbe.setParentName("AHV_HOLDING");

		// Column 1
		DbDataField dbe1 = new DbDataField();
		dbe1.setDbFieldName("PKID");
		dbe1.setIsPrimaryKey(true);
		dbe1.setDbFieldType(DbFieldType.NUMERIC);
		dbe1.setDbFieldSize(18);
		dbe1.setDbFieldScale(0);
		dbe1.setIsNull(false);
		dbe1.setLabel_code("ahv_animal_group.pkid");

		// Column 2
		DbDataField dbe2 = new DbDataField();
		dbe2.setDbFieldName("HOLDING_ID");
		dbe2.setDbFieldType(DbFieldType.NUMERIC);
		dbe2.setDbFieldScale(0);
		dbe2.setDbFieldSize(18);
		dbe2.setIndexName("AHV_AG_HOLDING_IDX");
		dbe2.setUnique_constraint_name("ANIMAL_GROUP_UNQ");
		dbe2.setIsNull(false);
		dbe2.setLabel_code("animal.holding_id");
		dbe2.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 3
		DbDataField dbe3 = new DbDataField();
		dbe3.setDbFieldName("ANIMAL_CATEGORY");
		dbe3.setDbFieldType(DbFieldType.NVARCHAR);
		dbe3.setDbFieldScale(0);
		dbe3.setDbFieldSize(100);
		dbe3.setUnique_constraint_name("ANIMAL_GROUP_UNQ");
		dbe3.setIsNull(false);
		dbe3.setLabel_code("ahv_animal_group.animal_category");
		dbe3.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 4
		DbDataField dbe4 = new DbDataField();
		dbe4.setDbFieldName("ANIMAL_TYPE");
		dbe4.setDbFieldType(DbFieldType.NVARCHAR);
		dbe4.setDbFieldScale(0);
		dbe4.setDbFieldSize(100);
		dbe4.setUnique_constraint_name("ANIMAL_GROUP_UNQ");
		dbe4.setIsNull(false);
		// dbe4.setCode_list_user_code("AHV_ANIMAL_TYPE");
		dbe4.setLabel_code("ahv_animal_group.animal_type");
		dbe4.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 5
		DbDataField dbe5 = new DbDataField();
		dbe5.setDbFieldName("NUMBER_ANIMAL");
		dbe5.setDbFieldType(DbFieldType.NUMERIC);
		dbe5.setDbFieldScale(0);
		dbe5.setDbFieldSize(20);
		dbe5.setLabel_code("ahv_animal_group.number_animal");
		dbe5.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 6
		DbDataField dbe6 = new DbDataField();
		dbe6.setDbFieldName("REGISTERED_ON");
		dbe6.setDbFieldType(DbFieldType.DATE);
		dbe6.setDbFieldScale(3);
		dbe6.setLabel_code("ahv_animal_group.registered_on");
		dbe6.setIsNull(true);
		dbe6.setGui_metadata(CONST_GUI_FIL_VIS_RES_RW);

		// Column 7
		DbDataField dbe7 = new DbDataField();
		dbe7.setDbFieldName("UPDATED_ON");
		dbe7.setDbFieldType(DbFieldType.DATE);
		dbe7.setDbFieldScale(3);
		dbe7.setLabel_code("ahv_animal_group.updated_on");
		dbe7.setIsNull(true);
		dbe7.setGui_metadata(CONST_GUI_FIL_VIS_RES_RW);

		DbDataField[] dbTableFields = new DbDataField[7];
		dbTableFields[0] = dbe1;
		dbTableFields[1] = dbe2;
		dbTableFields[2] = dbe3;
		dbTableFields[3] = dbe4;
		dbTableFields[4] = dbe5;
		dbTableFields[5] = dbe6;
		dbTableFields[6] = dbe7;

		dbe.setDbTableFields(dbTableFields);
		return dbe;
	}

	private static DbDataTable createAhvHolding() {
		DbDataTable dbe = new DbDataTable();
		dbe.setDbTableName("AHV_HOLDING");
		dbe.setDbRepoName(CONST_MASTER_REPO);
		dbe.setDbSchema(CONST_DEFAULT_SCHEMA);
		dbe.setIsSystemTable(false);
		dbe.setIsRepoTable(false);
		dbe.setLabel_code("ahv_holding.general");
		dbe.setUse_cache(false);

		// Column 1
		DbDataField dbe1 = new DbDataField();
		dbe1.setDbFieldName("PKID");
		dbe1.setIsPrimaryKey(true);
		dbe1.setDbFieldType(DbFieldType.NUMERIC);
		dbe1.setDbFieldSize(18);
		dbe1.setDbFieldScale(0);
		dbe1.setIsNull(false);
		dbe1.setLabel_code("ahv_holding.pkid");

		// Column 2
		DbDataField dbe2 = new DbDataField();
		dbe2.setDbFieldName("HOLDING_ID");
		dbe2.setDbFieldType(DbFieldType.NUMERIC);
		dbe2.setDbFieldScale(0);
		dbe2.setDbFieldSize(18);
		dbe2.setIsUnique(true);
		dbe2.setIsNull(false);
		dbe2.setIndexName("HOLDING_ID_IDX");
		dbe2.setUnique_constraint_name("HOLDING_UNQ");
		dbe2.setLabel_code("ahv_holding.holding_id");
		dbe2.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 3
		DbDataField dbe3 = new DbDataField();
		dbe3.setDbFieldName("HOLDING_LOCATION_CODE");
		dbe3.setDbFieldType(DbFieldType.NUMERIC);
		dbe3.setDbFieldScale(0);
		dbe3.setDbFieldSize(18);
		dbe3.setLabel_code("ahv_holding.holding_location_code");
		dbe3.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 4
		DbDataField dbe4 = new DbDataField();
		dbe4.setDbFieldName("OWNER_COMPANY_NAME");
		dbe4.setDbFieldType(DbFieldType.NVARCHAR);
		dbe4.setDbFieldScale(0);
		dbe4.setDbFieldSize(300);
		dbe4.setLabel_code("ahv_holding.owner_company_name");
		dbe4.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 6
		DbDataField dbe6 = new DbDataField();
		dbe6.setDbFieldName("HOLDING_MUNICIPALITY_CODE");
		dbe6.setDbFieldType(DbFieldType.NUMERIC);
		dbe6.setDbFieldSize(22);
		dbe6.setDbFieldScale(0);
		dbe6.setLabel_code("ahv_holding.holding_munic_code");
		dbe6.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 8
		DbDataField dbe8 = new DbDataField();
		dbe8.setDbFieldName("HOLDING_STREET");
		dbe8.setDbFieldType(DbFieldType.NVARCHAR);
		dbe8.setDbFieldSize(300);
		dbe8.setDbFieldScale(0);
		dbe8.setLabel_code("ahv_holding.holding_street");
		dbe8.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 9
		DbDataField dbe9 = new DbDataField();
		dbe9.setDbFieldName("HOLDING_ANIMAL_TYPE");
		dbe9.setDbFieldType(DbFieldType.NUMERIC);
		dbe9.setDbFieldSize(18);
		dbe9.setDbFieldScale(0);
		dbe9.setIsUnique(true);
		dbe9.setIsNull(false);
		dbe9.setUnique_constraint_name("HOLDING_UNQ");
		dbe9.setLabel_code("ahv_holding.holding_animal_type");
		dbe9.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 10
		DbDataField dbe10 = new DbDataField();
		dbe10.setDbFieldName("OWNER_NAME");
		dbe10.setDbFieldType(DbFieldType.NVARCHAR);
		dbe10.setDbFieldSize(200);
		dbe10.setDbFieldScale(0);
		dbe10.setLabel_code("ahv_holding.owner_name");
		dbe10.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 11
		DbDataField dbe11 = new DbDataField();
		dbe11.setDbFieldName("OWNER_LAST_NAME");
		dbe11.setDbFieldType(DbFieldType.NVARCHAR);
		dbe11.setDbFieldSize(200);
		dbe11.setDbFieldScale(0);
		dbe11.setLabel_code("ahv_holding.owner_last_name");
		dbe11.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 12
		DbDataField dbe12 = new DbDataField();
		dbe12.setDbFieldName("OWNER_LOCATION_CODE");
		dbe12.setDbFieldType(DbFieldType.NUMERIC);
		dbe12.setDbFieldSize(18);
		dbe12.setDbFieldScale(0);
		dbe12.setLabel_code("ahv_holding.owner_location_code");
		dbe12.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 15
		DbDataField dbe15 = new DbDataField();
		dbe15.setDbFieldName("OWNER_MUNICIPALITY_CODE");
		dbe15.setDbFieldType(DbFieldType.NUMERIC);
		dbe15.setDbFieldSize(18);
		dbe15.setDbFieldScale(0);
		dbe15.setLabel_code("ahv_holding.owner_municipality_code");
		dbe15.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 16
		DbDataField dbe16 = new DbDataField();
		dbe16.setDbFieldName("OWNER_STREET");
		dbe16.setDbFieldType(DbFieldType.NVARCHAR);
		dbe16.setDbFieldSize(300);
		dbe16.setDbFieldScale(0);
		dbe16.setLabel_code("ahv_holding.owner_street");
		dbe16.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 18
		DbDataField dbe18 = new DbDataField();
		dbe18.setDbFieldName("OWNER_NATIONAL_ID");
		dbe18.setDbFieldType(DbFieldType.NVARCHAR);
		dbe18.setDbFieldSize(13);
		dbe18.setDbFieldScale(0);
		dbe18.setLabel_code("ahv_holding.owner_national_id");
		dbe18.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 19
		DbDataField dbe19 = new DbDataField();
		dbe19.setDbFieldName("OWNER_VAT_NUMBER");
		dbe19.setDbFieldType(DbFieldType.NVARCHAR);
		dbe19.setDbFieldSize(13);
		dbe19.setDbFieldScale(0);
		dbe19.setLabel_code("ahv_holding.owner_vat_number");
		dbe19.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 20
		DbDataField dbe20 = new DbDataField();
		dbe20.setDbFieldName("OWNER_PHONE");
		dbe20.setDbFieldType(DbFieldType.NVARCHAR);
		dbe20.setDbFieldSize(150);
		dbe20.setDbFieldScale(0);
		dbe20.setLabel_code("ahv_holding.owner_phone");
		dbe20.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 21
		DbDataField dbe21 = new DbDataField();
		dbe21.setDbFieldName("UPDATED_ON");
		dbe21.setDbFieldType(DbFieldType.DATE);
		dbe21.setDbFieldScale(3);
		dbe21.setLabel_code("ahv_holding.updated_on");
		dbe21.setIsNull(true);
		dbe21.setGui_metadata(CONST_GUI_FIL_VIS_RES_RW);

		// Column 22
		DbDataField dbe22 = new DbDataField();
		dbe22.setDbFieldName("POPIS_OK");
		dbe22.setDbFieldType(DbFieldType.NUMERIC);
		dbe22.setDbFieldSize(18);
		dbe22.setDbFieldScale(0);
		dbe22.setLabel_code("ahv_holding.popis_ok");
		dbe22.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		DbDataField[] dbTableFields = new DbDataField[17];
		dbTableFields[0] = dbe1;
		dbTableFields[1] = dbe2;
		dbTableFields[2] = dbe3;
		dbTableFields[3] = dbe4;
		dbTableFields[4] = dbe6;
		dbTableFields[5] = dbe8;
		dbTableFields[6] = dbe9;
		dbTableFields[7] = dbe10;
		dbTableFields[8] = dbe11;
		dbTableFields[9] = dbe12;
		dbTableFields[10] = dbe15;
		dbTableFields[11] = dbe16;
		dbTableFields[12] = dbe18;
		dbTableFields[13] = dbe19;
		dbTableFields[14] = dbe20;
		dbTableFields[15] = dbe21;
		dbTableFields[16] = dbe22;

		dbe.setDbTableFields(dbTableFields);
		return dbe;
	}


	private static DbDataTable createAhvHoldingAutochton() {
		DbDataTable dbe = new DbDataTable();
		dbe.setDbTableName("AHV_HOLDING_AUTO");
		dbe.setDbRepoName(CONST_MASTER_REPO);
		dbe.setDbSchema(CONST_DEFAULT_SCHEMA);
		dbe.setIsSystemTable(false);
		dbe.setIsRepoTable(false);
		dbe.setLabel_code("ahv_holding.general");
		dbe.setUse_cache(false);

		// Column 1
		DbDataField dbe1 = new DbDataField();
		dbe1.setDbFieldName("PKID");
		dbe1.setIsPrimaryKey(true);
		dbe1.setDbFieldType(DbFieldType.NUMERIC);
		dbe1.setDbFieldSize(18);
		dbe1.setDbFieldScale(0);
		dbe1.setIsNull(false);
		dbe1.setLabel_code("ahv_holding.pkid");

		// Column 2
		DbDataField dbe2 = new DbDataField();
		dbe2.setDbFieldName("HOLDING_ID");
		dbe2.setDbFieldType(DbFieldType.NUMERIC);
		dbe2.setDbFieldScale(0);
		dbe2.setDbFieldSize(18);
		dbe2.setIsUnique(true);
		dbe2.setIsNull(false);
		dbe2.setIndexName("HOLDING_ID_IDX");
		dbe2.setUnique_constraint_name("HOLDING_UNQ");
		dbe2.setLabel_code("ahv_holding.holding_id");
		dbe2.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 3
		DbDataField dbe3 = new DbDataField();
		dbe3.setDbFieldName("HOLDING_LOCATION_CODE");
		dbe3.setDbFieldType(DbFieldType.NUMERIC);
		dbe3.setDbFieldScale(0);
		dbe3.setDbFieldSize(18);
		dbe3.setLabel_code("ahv_holding.holding_location_code");
		dbe3.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 4
		DbDataField dbe4 = new DbDataField();
		dbe4.setDbFieldName("OWNER_COMPANY_NAME");
		dbe4.setDbFieldType(DbFieldType.NVARCHAR);
		dbe4.setDbFieldScale(0);
		dbe4.setDbFieldSize(300);
		dbe4.setLabel_code("ahv_holding.owner_company_name");
		dbe4.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 6
		DbDataField dbe6 = new DbDataField();
		dbe6.setDbFieldName("HOLDING_MUNICIPALITY_CODE");
		dbe6.setDbFieldType(DbFieldType.NUMERIC);
		dbe6.setDbFieldSize(22);
		dbe6.setDbFieldScale(0);
		dbe6.setLabel_code("ahv_holding.holding_munic_code");
		dbe6.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 8
		DbDataField dbe8 = new DbDataField();
		dbe8.setDbFieldName("HOLDING_STREET");
		dbe8.setDbFieldType(DbFieldType.NVARCHAR);
		dbe8.setDbFieldSize(300);
		dbe8.setDbFieldScale(0);
		dbe8.setLabel_code("ahv_holding.holding_street");
		dbe8.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 9
		DbDataField dbe9 = new DbDataField();
		dbe9.setDbFieldName("HOLDING_ANIMAL_TYPE");
		dbe9.setDbFieldType(DbFieldType.NUMERIC);
		dbe9.setDbFieldSize(18);
		dbe9.setDbFieldScale(0);
		dbe9.setIsUnique(true);
		dbe9.setIsNull(false);
		dbe9.setUnique_constraint_name("HOLDING_UNQ");
		dbe9.setLabel_code("ahv_holding.holding_animal_type");
		dbe9.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 10
		DbDataField dbe10 = new DbDataField();
		dbe10.setDbFieldName("OWNER_NAME");
		dbe10.setDbFieldType(DbFieldType.NVARCHAR);
		dbe10.setDbFieldSize(200);
		dbe10.setDbFieldScale(0);
		dbe10.setLabel_code("ahv_holding.owner_name");
		dbe10.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 11
		DbDataField dbe11 = new DbDataField();
		dbe11.setDbFieldName("OWNER_LAST_NAME");
		dbe11.setDbFieldType(DbFieldType.NVARCHAR);
		dbe11.setDbFieldSize(200);
		dbe11.setDbFieldScale(0);
		dbe11.setLabel_code("ahv_holding.owner_last_name");
		dbe11.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 12
		DbDataField dbe12 = new DbDataField();
		dbe12.setDbFieldName("OWNER_LOCATION_CODE");
		dbe12.setDbFieldType(DbFieldType.NUMERIC);
		dbe12.setDbFieldSize(18);
		dbe12.setDbFieldScale(0);
		dbe12.setLabel_code("ahv_holding.owner_location_code");
		dbe12.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 15
		DbDataField dbe15 = new DbDataField();
		dbe15.setDbFieldName("OWNER_MUNICIPALITY_CODE");
		dbe15.setDbFieldType(DbFieldType.NUMERIC);
		dbe15.setDbFieldSize(18);
		dbe15.setDbFieldScale(0);
		dbe15.setLabel_code("ahv_holding.owner_municipality_code");
		dbe15.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 16
		DbDataField dbe16 = new DbDataField();
		dbe16.setDbFieldName("OWNER_STREET");
		dbe16.setDbFieldType(DbFieldType.NVARCHAR);
		dbe16.setDbFieldSize(300);
		dbe16.setDbFieldScale(0);
		dbe16.setLabel_code("ahv_holding.owner_street");
		dbe16.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 18
		DbDataField dbe18 = new DbDataField();
		dbe18.setDbFieldName("OWNER_NATIONAL_ID");
		dbe18.setDbFieldType(DbFieldType.NVARCHAR);
		dbe18.setDbFieldSize(13);
		dbe18.setDbFieldScale(0);
		dbe18.setLabel_code("ahv_holding.owner_national_id");
		dbe18.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 19
		DbDataField dbe19 = new DbDataField();
		dbe19.setDbFieldName("OWNER_VAT_NUMBER");
		dbe19.setDbFieldType(DbFieldType.NVARCHAR);
		dbe19.setDbFieldSize(13);
		dbe19.setDbFieldScale(0);
		dbe19.setLabel_code("ahv_holding.owner_vat_number");
		dbe19.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 20
		DbDataField dbe20 = new DbDataField();
		dbe20.setDbFieldName("OWNER_PHONE");
		dbe20.setDbFieldType(DbFieldType.NVARCHAR);
		dbe20.setDbFieldSize(150);
		dbe20.setDbFieldScale(0);
		dbe20.setLabel_code("ahv_holding.owner_phone");
		dbe20.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		// Column 21
		DbDataField dbe21 = new DbDataField();
		dbe21.setDbFieldName("UPDATED_ON");
		dbe21.setDbFieldType(DbFieldType.DATE);
		dbe21.setDbFieldScale(3);
		dbe21.setLabel_code("ahv_holding.updated_on");
		dbe21.setIsNull(true);
		dbe21.setGui_metadata(CONST_GUI_FIL_VIS_RES_RW);

		// Column 22
		DbDataField dbe22 = new DbDataField();
		dbe22.setDbFieldName("POPIS_OK");
		dbe22.setDbFieldType(DbFieldType.NUMERIC);
		dbe22.setDbFieldSize(18);
		dbe22.setDbFieldScale(0);
		dbe22.setLabel_code("ahv_holding.popis_ok");
		dbe22.setGui_metadata(CONST_GUI_FIL_VIS_RES_RO);

		DbDataField[] dbTableFields = new DbDataField[17];
		dbTableFields[0] = dbe1;
		dbTableFields[1] = dbe2;
		dbTableFields[2] = dbe3;
		dbTableFields[3] = dbe4;
		dbTableFields[4] = dbe6;
		dbTableFields[5] = dbe8;
		dbTableFields[6] = dbe9;
		dbTableFields[7] = dbe10;
		dbTableFields[8] = dbe11;
		dbTableFields[9] = dbe12;
		dbTableFields[10] = dbe15;
		dbTableFields[11] = dbe16;
		dbTableFields[12] = dbe18;
		dbTableFields[13] = dbe19;
		dbTableFields[14] = dbe20;
		dbTableFields[15] = dbe21;
		dbTableFields[16] = dbe22;

		dbe.setDbTableFields(dbTableFields);
		return dbe;
	}
	
	
	private static DbDataTable createAhvLocation() {
		DbDataTable dbe = new DbDataTable();
		dbe.setDbTableName("ahv_location");
		dbe.setDbRepoName("{MASTER_REPO}");
		dbe.setDbSchema("{DEFAULT_SCHEMA}");
		dbe.setIsSystemTable(false);
		dbe.setIsRepoTable(false);
		dbe.setLabel_code("master_repo.ahv_location");
		dbe.setUse_cache(false);

		DbDataField dbe1 = new DbDataField();
		dbe1.setDbFieldName("PKID");
		dbe1.setIsPrimaryKey(true);
		dbe1.setDbFieldType(DbFieldType.NUMERIC);
		dbe1.setDbFieldSize(18);
		dbe1.setDbFieldScale(0);
		dbe1.setIsNull(false);
		dbe1.setLabel_code("ahv_location.pkid");

		DbDataField dbe2 = new DbDataField();
		dbe2.setDbFieldName("MUNIC");
		dbe2.setDbFieldType(DbFieldType.NVARCHAR);
		dbe2.setDbFieldSize(100);
		dbe2.setIsNull(false);
		dbe2.setLabel_code("ahv_location.munic");

		DbDataField dbe3 = new DbDataField();
		dbe3.setDbFieldName("CODE_MUNIC");
		dbe3.setDbFieldType(DbFieldType.NUMERIC);
		dbe3.setDbFieldSize(18);
		dbe3.setIsNull(false);
		dbe3.setLabel_code("ahv_location.code_munic");

		DbDataField dbe4 = new DbDataField();
		dbe4.setDbFieldName("POP_PLACE");
		dbe4.setDbFieldType(DbFieldType.NVARCHAR);
		dbe4.setDbFieldSize(100);
		dbe4.setIsNull(false);
		dbe4.setIsUnique(true);
		dbe4.setLabel_code("ahv_location.pop_place");

		DbDataField dbe5 = new DbDataField();
		dbe5.setDbFieldName("CODE_POP_PLACE");
		dbe5.setDbFieldType(DbFieldType.NUMERIC);
		dbe5.setDbFieldSize(18);
		dbe5.setIsNull(false);
		dbe5.setIsUnique(true);
		dbe5.setLabel_code("ahv_location.code_pop_place");

		DbDataField dbe6 = new DbDataField();
		dbe6.setDbFieldName("IS_RURAL");
		dbe6.setDbFieldType(DbFieldType.NVARCHAR);
		dbe6.setDbFieldSize(1);
		dbe6.setIsNull(false);
		dbe6.setLabel_code("ahv_location.is_rural");

		DbDataField[] dbTableFields = new DbDataField[6];
		dbTableFields[0] = dbe1;
		dbTableFields[1] = dbe2;
		dbTableFields[2] = dbe3;
		dbTableFields[3] = dbe4;
		dbTableFields[4] = dbe5;
		dbTableFields[5] = dbe6;

		dbe.setDbTableFields(dbTableFields);
		return dbe;
	}
	
	// TABLE RECEIPT_MILK
		private static DbDataTable createReceiptMilk() {

			DbDataTable dbe = new DbDataTable();
			dbe.setDbTableName("RECEIPT_MILK");
			dbe.setDbRepoName("{MASTER_REPO}");
			dbe.setDbSchema("{DEFAULT_SCHEMA}");
			dbe.setIsSystemTable(false);
			dbe.setIsRepoTable(false);
			dbe.setLabel_code("master_repo.receipt_milk");
			dbe.setUse_cache(false);
			dbe.setIsConfigTable(false);
			dbe.setParentName("APPLICATION");

			// Column 1
			DbDataField dbf1 = new DbDataField();
			dbf1.setDbFieldName("PKID");
			dbf1.setIsPrimaryKey(true);
			dbf1.setDbFieldType(DbFieldType.NUMERIC);
			dbf1.setDbFieldSize(18);
			dbf1.setIsNull(false);
			dbf1.setLabel_code("master_repo.table_meta_pkid");
			
			// Column 2
			DbDataField dbf2 = new DbDataField();
			dbf2.setDbFieldName("CONFIRMATION");
			dbf2.setDbFieldType(DbFieldType.NVARCHAR);
			dbf2.setDbFieldSize(1);
			dbf2.setIsNull(false);
			dbf2.setLabel_code("receipt_milk.confirmation");	
			dbf2.setCode_list_user_code("CONFIRMATION");
			dbf2.setGui_metadata("{\"react\":{\"filterable\":true,\"sortable\":true,\"visible\":true,\"resizable\":true,\"editable\":false}}");

			// Column 5
			DbDataField dbf5 = new DbDataField();
			dbf5.setDbFieldName("ID_NO");
			dbf5.setDbFieldType(DbFieldType.NVARCHAR);
			dbf5.setDbFieldSize(16);
			dbf5.setIsNull(true);
			dbf5.setLabel_code("receipt_milk.id_no");	
			dbf5.setGui_metadata("{\"react\":{\"filterable\":true,\"sortable\":true,\"visible\":true,\"resizable\":true,\"editable\":false}}");

			// Column 8
			DbDataField dbf8 = new DbDataField();
			dbf8.setDbFieldName("LITERS");
			dbf8.setDbFieldType(DbFieldType.NUMERIC);
			dbf8.setDbFieldSize(18);
			dbf8.setDbFieldScale(0);
			dbf8.setIsNull(false);
			dbf8.setLabel_code("receipt_milk.liters");
			dbf8.setGui_metadata("{\"react\":{\"filterable\":true,\"sortable\":true,\"visible\":true,\"resizable\":true,\"editable\":false}}");
			
			// Column 11
			DbDataField dbf11 = new DbDataField();
			dbf11.setDbFieldName("MILK_TYPE");
			dbf11.setDbFieldType(DbFieldType.NVARCHAR);
			dbf11.setDbFieldSize(2);
			dbf11.setIsNull(false);
			dbf11.setLabel_code("receipt_milk.milk_type");	
			dbf11.setCode_list_user_code("MILK_TYPE");
			dbf11.setGui_metadata("{\"react\":{\"filterable\":true,\"sortable\":true,\"visible\":true,\"resizable\":true,\"editable\":false}}");

			// Column 14
			DbDataField dbf14 = new DbDataField();
			dbf14.setDbFieldName("DAIRY_FARM");
			dbf14.setDbFieldType(DbFieldType.NVARCHAR);
			dbf14.setDbFieldSize(5);
			dbf14.setIsNull(false);
			dbf14.setLabel_code("receipt_milk.dairy_farm");	
			dbf14.setCode_list_user_code("MILK_DAIRY");
			dbf14.setGui_metadata("{\"react\":{\"filterable\":true,\"sortable\":true,\"visible\":true,\"resizable\":true,\"editable\":false}}");

			// Column 17
			DbDataField dbf17 = new DbDataField();
			dbf17.setDbFieldName("MONTH");
			dbf17.setDbFieldType(DbFieldType.NVARCHAR);
			dbf17.setDbFieldSize(2);
			dbf17.setIsNull(false);
			dbf17.setLabel_code("receipt_milk.month");	
			dbf17.setCode_list_user_code("MONTHS");
			dbf17.setGui_metadata("{\"react\":{\"filterable\":true,\"sortable\":true,\"visible\":true,\"resizable\":true,\"editable\":false}}");

			// Column 18
			DbDataField dbf18 = new DbDataField();
			dbf18.setDbFieldName("MODULE_YEAR");
			dbf18.setDbFieldType(DbFieldType.NUMERIC);
			dbf18.setDbFieldSize(18);
			dbf18.setDbFieldScale(0);
			dbf18.setIsNull(true);
			dbf18.setLabel_code("receipt_milk.module_year");
			dbf18.setGui_metadata("{\"react\":{\"filterable\":true,\"sortable\":true,\"visible\":true,\"resizable\":true,\"editable\":false}}");
			
			DbDataField[] dbTableFields = new DbDataField[8];
			dbTableFields[0] = dbf1;
			dbTableFields[1] = dbf2;
			dbTableFields[2] = dbf5;	
			dbTableFields[3] = dbf8;	
			dbTableFields[4] = dbf11;
			dbTableFields[5] = dbf14;
			dbTableFields[6] = dbf17;	
			dbTableFields[7] = dbf18;	
			dbe.setDbTableFields(dbTableFields);
			return dbe;
			
		}

	// CAD_PARCEL
	private static DbDataTable createCadParcel() {
		DbDataTable dbe = new DbDataTable();
		dbe.setDbTableName("CAD_PARCEL");
		dbe.setDbRepoName(CONST_MASTER_REPO);
		dbe.setDbSchema(CONST_DEFAULT_SCHEMA);
		dbe.setIsSystemTable(false);
		dbe.setIsRepoTable(false);
		dbe.setLabel_code("cad_parcel.general");
		dbe.setParentName(CONST_FARMER);
		dbe.setUse_cache(false);
		// Column 1N
		DbDataField dbe1 = new DbDataField();
		dbe1.setDbFieldName("PKID");
		dbe1.setIsPrimaryKey(true);
		dbe1.setDbFieldType(DbFieldType.NUMERIC);
		dbe1.setDbFieldSize(18);
		dbe1.setDbFieldScale(0);
		dbe1.setIsNull(false);
		dbe1.setLabel_code("cad_parcel.pkid");
		// Column 2
		DbDataField dbe2 = new DbDataField();
		dbe2.setDbFieldName("OLD_FARMER_PKID");
		dbe2.setDbFieldType(DbFieldType.NUMERIC);
		dbe2.setLabel_code("cad_parcel.old_farmer_pkid");
		dbe2.setGui_metadata(
				addReactGuiMeta(getDefaultUiMeta(true, true, false, false), "CAD_PARCEL", dbe2.getDbFieldName())
						.toString());
		// Column 3
		DbDataField dbe3 = new DbDataField();
		dbe3.setDbFieldName("FIC");
		dbe3.setDbFieldType(DbFieldType.NVARCHAR);
		dbe3.setDbFieldScale(0);
		dbe3.setDbFieldSize(16);
		dbe3.setIndexName("CAD_FIC_IDX");
		dbe3.setLabel_code("cad_parcel.fic");
		dbe3.setGui_metadata(addReactGuiMeta(getUiWidth(getDefaultUiMeta(true, true, false, false), 72), "CAD_PARCEL",
				dbe3.getDbFieldName()).toString());
		// Column 4
		DbDataField dbe4 = new DbDataField();
		dbe4.setDbFieldName("VALID_FROM");
		dbe4.setDbFieldType(DbFieldType.TIMESTAMP);
		dbe4.setDbFieldSize(3);
		dbe4.setLabel_code("cad_parcel.valid_from");
		dbe4.setGui_metadata(
				addReactGuiMeta(getDefaultUiMeta(true, true, false, false), "CAD_PARCEL", dbe4.getDbFieldName())
						.toString());
		// Column 5
		DbDataField dbe5 = new DbDataField();
		dbe5.setDbFieldName("VALID_TO");
		dbe5.setDbFieldType(DbFieldType.TIMESTAMP);
		dbe5.setDbFieldSize(3);
		dbe5.setLabel_code("cad_parcel.valid_to");
		dbe5.setGui_metadata(
				addReactGuiMeta(getDefaultUiMeta(true, true, false, false), "CAD_PARCEL", dbe5.getDbFieldName())
						.toString());
		// Column 6
		DbDataField dbe6 = new DbDataField();
		dbe6.setDbFieldName("PARCEL_ID");
		dbe6.setDbFieldType(DbFieldType.NVARCHAR);
		dbe6.setDbFieldScale(0);
		dbe6.setDbFieldSize(5);
		dbe6.setIndexName("CAD_ID_IDX");
		dbe6.setLabel_code("cad_parcel.parcel_id");
		dbe6.setGui_metadata(addReactGuiMeta(getUiWidth(getDefaultUiMeta(false, false, false, false), 72), "CAD_PARCEL",
				dbe6.getDbFieldName()).toString());
		// Column 7
		DbDataField dbe7 = new DbDataField();
		dbe7.setDbFieldName("NATIONAL_CODE");
		dbe7.setDbFieldType(DbFieldType.NVARCHAR);
		dbe7.setDbFieldScale(0);
		dbe7.setDbFieldSize(4);
		dbe7.setLabel_code("cad_parcel.national_code");
		dbe7.setCode_list_user_code("NATIONAL_COMMON_CODELIST");
		dbe7.setGui_metadata(
				"{\"hidden\":true,\"editoptions\":{\"readonly\":true},\"react\":{\"filterable\":true,\"width\":100,\"visible\":true,\"resizable\":true,\"editable\":false,\"uischema\":{\"ui:readonly\":true}}}");
		// Column 8
		DbDataField dbe8 = new DbDataField();
		dbe8.setDbFieldName("SHEET");
		dbe8.setDbFieldType(DbFieldType.NUMERIC);
		dbe8.setLabel_code("cad_parcel.sheet");
		dbe8.setGui_metadata(
				addReactGuiMeta(getDefaultUiMeta(true, true, false, false), "CAD_PARCEL", dbe8.getDbFieldName())
						.toString());
		// Column 9
		DbDataField dbe9 = new DbDataField();
		dbe9.setDbFieldName("SUB");
		dbe9.setDbFieldType(DbFieldType.NVARCHAR);
		dbe9.setDbFieldScale(0);
		dbe9.setDbFieldSize(3);
		dbe9.setLabel_code("cad_parcel.sub");
		dbe9.setGui_metadata(addReactGuiMeta(getUiWidth(getDefaultUiMeta(true, false, false, false), 70), "CAD_PARCEL",
				dbe9.getDbFieldName()).toString());
		// Column 10
		DbDataField dbe10 = new DbDataField();
		dbe10.setDbFieldName("HOLDING_TYPE_CODE");
		dbe10.setDbFieldType(DbFieldType.NVARCHAR);
		dbe10.setDbFieldScale(0);
		dbe10.setDbFieldSize(5);
		// dbe10.setCode_list_user_code("HOLDING_TYPE_CODE");
		dbe10.setLabel_code("cad_parcel.holding_type_code");
		dbe10.setGui_metadata(addReactGuiMeta(getUiWidth(getDefaultUiMeta(true, false, false, false), 114),
				"CAD_PARCEL", dbe10.getDbFieldName()).toString());
		// Column 11
		DbDataField dbe11 = new DbDataField();
		dbe11.setDbFieldName("PERC_OWNERSHIP");
		dbe11.setDbFieldType(DbFieldType.NUMERIC);
		dbe11.setLabel_code("cad_parcel.perc_ownership");
		dbe11.setGui_metadata(addReactGuiMeta(getUiWidth(getDefaultUiMeta(true, false, false, false), 69), "CAD_PARCEL",
				dbe11.getDbFieldName()).toString());
		// Column 12
		DbDataField dbe12 = new DbDataField();
		dbe12.setDbFieldName("AREA");
		dbe12.setDbFieldType(DbFieldType.NUMERIC);
		dbe12.setLabel_code("cad_parcel.area");
		dbe12.setGui_metadata(addReactGuiMeta(getUiWidth(getDefaultUiMeta(true, false, false, false), 59), "CAD_PARCEL",
				dbe12.getDbFieldName()).toString());
		// Column 13
		DbDataField dbe13 = new DbDataField();
		dbe13.setDbFieldName("NATIONAL_CODE_NAME");
		dbe13.setDbFieldType(DbFieldType.NVARCHAR);
		dbe13.setDbFieldScale(0);
		dbe13.setDbFieldSize(100);
		dbe13.setLabel_code("cad_parcel.national_code_name");
		dbe13.setGui_metadata(addReactGuiMeta(getUiWidth(getDefaultUiMeta(true, false, false, false), 63), "CAD_PARCEL",
				dbe13.getDbFieldName()).toString());
		// Column 14
//		DbDataField dbe14 = new DbDataField();
//		dbe14.setDbFieldName("IS_RURAL");
//		dbe14.setDbFieldType(DbFieldType.BOOLEAN);
//		dbe14.setLabel_code("cad_parcel.is_rural");
//		dbe14.setGui_metadata(
//				addReactGuiMeta(getDefaultUiMeta(true, true, false, false), "CAD_PARCEL", dbe14.getDbFieldName())
//						.toString());
//
//		// Column 15
//		DbDataField dbe15 = new DbDataField();
//		dbe15.setDbFieldName("IS_RURAL_2017");
//		dbe15.setDbFieldType(DbFieldType.BOOLEAN);
//		dbe15.setLabel_code("cad_parcel.is_rural");
//		dbe15.setGui_metadata(
//				addReactGuiMeta(getDefaultUiMeta(true, true, false, false), "CAD_PARCEL", dbe15.getDbFieldName())
//						.toString());
//
//		// Column 16
//		DbDataField dbe16 = new DbDataField();
//		dbe16.setDbFieldName("IS_RURAL_2018");
//		dbe16.setDbFieldType(DbFieldType.BOOLEAN);
//		dbe16.setLabel_code("cad_parcel.is_rural");
//		dbe16.setGui_metadata(
//				addReactGuiMeta(getDefaultUiMeta(true, true, false, false), "CAD_PARCEL", dbe16.getDbFieldName())
//						.toString());
//
//		// Column 17
//		DbDataField dbe17 = new DbDataField();
//		dbe17.setDbFieldName("ID");
//		dbe17.setDbFieldType(DbFieldType.NUMERIC);
//		dbe17.setLabel_code("cad_parcel.id");
//		dbe17.setDbFieldSize(19);
//		dbe17.setDbFieldScale(0);
//		dbe17.setGui_metadata(
//				addReactGuiMeta(getDefaultUiMeta(true, true, false, false), "CAD_PARCEL", dbe17.getDbFieldName())
//						.toString());

		// Column 18
		DbDataField dbe18 = new DbDataField();
		dbe18.setDbFieldName("MUNICIPALITY_NAME");
		dbe18.setDbFieldType(DbFieldType.NVARCHAR);
		dbe18.setLabel_code("cad_parcel.municipality_name");
		dbe18.setDbFieldSize(250);
		dbe18.setGui_metadata(
				addReactGuiMeta(getDefaultUiMeta(true, true, false, false), "CAD_PARCEL", dbe18.getDbFieldName())
						.toString());

		// Column 19
		DbDataField dbe19 = new DbDataField();
		dbe19.setDbFieldName("DEPARTMENT_CODE");
		dbe19.setDbFieldType(DbFieldType.NVARCHAR);
		dbe19.setLabel_code("cad_parcel.department_code");
		dbe19.setDbFieldSize(50);
		dbe19.setGui_metadata(
				addReactGuiMeta(getDefaultUiMeta(true, true, false, false), "CAD_PARCEL", dbe19.getDbFieldName())
						.toString());

		// Column 20
		DbDataField dbe20 = new DbDataField();
		dbe20.setDbFieldName("DEPARTMENT_NAME");
		dbe20.setDbFieldType(DbFieldType.NVARCHAR);
		dbe20.setLabel_code("cad_parcel.department_name");
		dbe20.setDbFieldSize(250);
		dbe20.setGui_metadata(
				addReactGuiMeta(getDefaultUiMeta(true, true, false, false), "CAD_PARCEL", dbe20.getDbFieldName())
						.toString());

		DbDataField[] dbTableFields = new DbDataField[16];
		dbTableFields[0] = dbe1;
		dbTableFields[1] = dbe2;
		dbTableFields[2] = dbe3;
		dbTableFields[3] = dbe4;
		dbTableFields[4] = dbe5;
		dbTableFields[5] = dbe6;
		dbTableFields[6] = dbe13;
		dbTableFields[7] = dbe7;
		dbTableFields[8] = dbe8;
		dbTableFields[9] = dbe9;
		dbTableFields[10] = dbe10;
		dbTableFields[11] = dbe11;
		dbTableFields[12] = dbe12;
//		dbTableFields[13] = dbe14;
//		dbTableFields[14] = dbe15;
//		dbTableFields[15] = dbe16;
//		dbTableFields[13] = dbe17;
		dbTableFields[13] = dbe18;
		dbTableFields[14] = dbe19;
		dbTableFields[15] = dbe20;
		dbe.setDbTableFields(dbTableFields);
		return dbe;
	}

	// LINK_POA_ORG_UNIT_FARM
	private static DbDataObject createLinkOrgUnitPerson() {
		DbDataObject dbLink = new DbDataObject();
		dbLink.setObjectType(svCONST.OBJECT_TYPE_LINK_TYPE);
		dbLink.setVal("LINK_TYPE", "POA");
		dbLink.setVal("DEFER_SECURITY", true);
		dbLink.setVal("LINK_TYPE_DESCRIPTION", "link between ORG_UNITS and PERSON");
		dbLink.setVal("LINK_OBJ_TYPE_1", ("ORG_UNITS"));
		dbLink.setVal("LINK_OBJ_TYPE_2", ("PERSON"));
		return dbLink;
	}


	
	// LINK_POA_ORG_UNIT_USER_GROUP
	private static DbDataObject createLinkOrgUnitGroup() {
			DbDataObject dbLink = new DbDataObject();
			dbLink.setObjectType(svCONST.OBJECT_TYPE_LINK_TYPE);
			dbLink.setVal("LINK_TYPE", "POA");
			dbLink.setVal("DEFER_SECURITY", true);
			dbLink.setVal("LINK_TYPE_DESCRIPTION", "link between ORG_UNITS and GROUP");
			dbLink.setVal("LINK_OBJ_TYPE_1", ("ORG_UNITS"));
			dbLink.setVal("LINK_OBJ_TYPE_2", ("SVAROG_USER_GROUPS"));
			return dbLink;
	}

	
	// LINK_FILE
	private static DbDataObject createFarmFilesLink() {
			DbDataObject dbLink = new DbDataObject();
			dbLink.setObjectType(svCONST.OBJECT_TYPE_LINK_TYPE);
			dbLink.setVal("LINK_TYPE", "LINK_FILE");
			dbLink.setVal("LINK_TYPE_DESCRIPTION", "link between FARM and FILE");
			dbLink.setVal("LINK_OBJ_TYPE_1", "FARM");
			dbLink.setVal("LINK_OBJ_TYPE_2", svCONST.OBJECT_TYPE_FILE);
			return dbLink;
	}
	
	private static DbDataObject createUserFilesLink() {
			DbDataObject dbLink = new DbDataObject();
			dbLink.setObjectType(svCONST.OBJECT_TYPE_LINK_TYPE);
			dbLink.setVal("LINK_TYPE", "LINK_FILE");
			dbLink.setVal("LINK_TYPE_DESCRIPTION", "link between USER and FILE");
			dbLink.setVal("LINK_OBJ_TYPE_1", svCONST.OBJECT_TYPE_USER);
			dbLink.setVal("LINK_OBJ_TYPE_2", svCONST.OBJECT_TYPE_FILE);
			return dbLink;
}

	@Override
	public ArrayList<DbDataTable> getCustomObjectTypes() {
		DbDataTable dbtt = null;
		ArrayList<DbDataTable> dbtList = new ArrayList<DbDataTable>();
		dbtt = DbInit.createHoldingType();
		dbtList.add(addSortOrder(dbtt));
		dbtt = DbInit.createCertificationInfo();
		dbtList.add(addSortOrder(dbtt));
		dbtt = DbInit.createFarm();
		dbtList.add(addSortOrder(dbtt));
		dbtt = DbInit.createFarmer();
		dbtList.add(addSortOrder(dbtt));
		dbtt = DbInit.createFarmMembers();
		dbtList.add(addSortOrder(dbtt));
		dbtt = DbInit.createAnimalType();
		dbtList.add(addSortOrder(dbtt));
		dbtt = DbInit.createAhvSingleAnimal();
		dbtList.add(addSortOrder(dbtt));
		dbtt = DbInit.createAhvSingleAnimalAutochton();
		dbtList.add(addSortOrder(dbtt));
		dbtt = DbInit.createAhvHolding();
		dbtList.add(addSortOrder(dbtt));
		dbtt = DbInit.createAhvHoldingAutochton();
		dbtList.add(addSortOrder(dbtt));
		dbtt = DbInit.createAhvAnimalGroup();
		dbtList.add(addSortOrder(dbtt));
		dbtt = DbInit.createAhvLocation();
		dbtList.add(addSortOrder(dbtt));
		dbtt = DbInit.createLandUsePlan();
		dbtList.add(addSortOrder(dbtt));
		dbtt = DbInit.createLandUseCode();
		dbtList.add(addSortOrder(dbtt));
//		dbtt = DbInit.createReceiptMilk();
//		dbtList.add(addSortOrder(dbtt));
		dbtt = DbInit.createCadParcel();
		dbtList.add(addSortOrder(dbtt));
		dbtt = DbInit.createLandUseYear();
		dbtList.add(addSortOrder(dbtt));

		dbtt = DbInit.createEquipment();
		dbtList.add(addSortOrder(dbtt));


		return dbtList;
	}

	@Override
	public ArrayList<DbDataObject> getCustomObjectInstances() {
		ArrayList<DbDataObject> dbtList = new ArrayList<DbDataObject>();
		dbtList.add(createLinkOrgUnitPerson());
		dbtList.add(createLinkOrgUnitGroup());
		dbtList.add(createFarmFilesLink());
		dbtList.add(createUserFilesLink());
		//dbtList.add(createLinkSupportClaimWithReceiptMilk());
		return dbtList;
	}

	// CROP
	private static DbDataTable createLandUseCode() {
		DbDataTable dbe = new DbDataTable();
		dbe.setDbTableName("LAND_USE_CODE");
		dbe.setDbRepoName(CONST_MASTER_REPO);
		dbe.setDbSchema(CONST_DEFAULT_SCHEMA);
		dbe.setIsSystemTable(false);
		dbe.setIsRepoTable(false);
		dbe.setConfigColumnName("LABEL_CODE");
		dbe.setIsConfigTable(true);
		dbe.setLabel_code("land_use.general");
		dbe.setUse_cache(false);
		// Column 1N
		DbDataField dbe1 = new DbDataField();
		dbe1.setDbFieldName("PKID");
		dbe1.setIsPrimaryKey(true);
		dbe1.setDbFieldType(DbFieldType.NUMERIC);
		dbe1.setDbFieldSize(18);
		dbe1.setDbFieldScale(0);
		dbe1.setIsNull(false);
		dbe1.setLabel_code("land_use.pkid");
		// Column 2
		DbDataField dbe2 = new DbDataField();
		dbe2.setDbFieldName("LAND_USE_CODE");
		dbe2.setIndexName("land_use_code");
		dbe2.setDbFieldType(DbFieldType.NUMERIC);
		dbe2.setDbFieldSize(18);
		dbe2.setDbFieldScale(0);
		dbe2.setIndexName("LANDUSE_CODE_IDX");
		dbe2.setCode_list_user_code("LAND_USES");
		dbe2.setLabel_code("land_use.crop_code");
		// Column 3
		DbDataField dbe3 = new DbDataField();
		dbe3.setDbFieldName("LAND_USE_DESCRIPTION");
		dbe3.setDbFieldType(DbFieldType.NVARCHAR);
		dbe3.setDbFieldScale(0);
		dbe3.setDbFieldSize(2000);
		dbe3.setLabel_code("land_use.crop_description");
		// Column 4
		DbDataField dbe4 = new DbDataField();
		dbe4.setDbFieldName("BASIC_LAND_USE_CODE");
		dbe4.setDbFieldType(DbFieldType.NVARCHAR);
		dbe4.setDbFieldScale(0);
		dbe4.setDbFieldSize(18);
		dbe4.setLabel_code("land_use.base_crop_code");
		// Column 5
		DbDataField dbe5 = new DbDataField();
		dbe5.setDbFieldName("LABEL_CODE");
		dbe5.setDbFieldType(DbFieldType.NVARCHAR);
		dbe5.setDbFieldScale(0);
		dbe5.setDbFieldSize(50);
		dbe5.setIsUnique(true);
		dbe5.setUnique_level("TABLE");
		dbe5.setLabel_code("mnemonic.label_code");
		// Column 6
		DbDataField dbe6 = new DbDataField();
		dbe6.setDbFieldName("MANDATORY_TREE_CNT");
		dbe6.setDbFieldType(DbFieldType.BOOLEAN);
		dbe6.setLabel_code("land_use.mandatory_tree_cnt");
		DbDataField[] dbTableFields = new DbDataField[6];
		dbTableFields[0] = dbe1;
		dbTableFields[1] = dbe2;
		dbTableFields[2] = dbe3;
		dbTableFields[3] = dbe4;
		dbTableFields[4] = dbe6;
		dbTableFields[5] = dbe5;
		dbe.setDbTableFields(dbTableFields);
		return dbe;
	}

	private static DbDataTable createLandUseYear() {
		DbDataTable dbe = new DbDataTable();
		dbe.setDbTableName("LAND_USE_YEAR");
		dbe.setDbRepoName(CONST_MASTER_REPO);
		dbe.setDbSchema(CONST_DEFAULT_SCHEMA);
		dbe.setIsSystemTable(false);
		dbe.setIsRepoTable(false);
		dbe.setLabel_code("master_repo.land_use_year");
		dbe.setUse_cache(false);
		dbe.setIsConfigTable(false);

		// Column 1
		DbDataField dbf1 = new DbDataField();
		dbf1.setDbFieldName("PKID");
		dbf1.setIsPrimaryKey(true);
		dbf1.setDbFieldType(DbFieldType.NUMERIC);
		dbf1.setDbFieldSize(18);
		dbf1.setDbFieldScale(0);
		dbf1.setIsNull(false);
		dbf1.setLabel_code("master_repo.table_meta_pkid");

		// Column 2
		DbDataField dbf2 = new DbDataField();
		dbf2.setDbFieldName("LAND_USE_OBJECT_ID");
		dbf2.setDbFieldType(DbFieldType.NUMERIC);
		dbf2.setDbFieldSize(18);
		dbf2.setIsNull(false);
		dbf2.setLabel_code("land_use_year.land_use_object_id");
		dbf2.setSort_order(10002);

		// Column 3
		DbDataField dbf3 = new DbDataField();
		dbf3.setDbFieldName("LAND_COVER_CODE");
		dbf3.setDbFieldType(DbFieldType.NVARCHAR);
		dbf3.setDbFieldSize(18);
		dbf3.setIsNull(false);
		dbf3.setLabel_code("land_use_year.land_cover_code");
		dbf3.setSort_order(10003);

		// Column 4
		DbDataField dbf4 = new DbDataField();
		dbf4.setDbFieldName("YEAR");
		dbf4.setDbFieldType(DbFieldType.NVARCHAR);
		dbf4.setDbFieldSize(4);
		dbf4.setIsNull(false);
		dbf4.setLabel_code("land_use_year.year");
		dbf4.setSort_order(10004);

		// Column 5
		DbDataField dbf5 = new DbDataField();
		dbf5.setDbFieldName("LABEL_CODE");
		dbf5.setDbFieldType(DbFieldType.NVARCHAR);
		dbf5.setDbFieldScale(0);
		dbf5.setDbFieldSize(50);
		dbf5.setIsUnique(true);
		dbf5.setIsNull(false);
		dbf5.setLabel_code("master_repo.label_code");

		DbDataField[] dbTableFields = new DbDataField[5];
		dbTableFields[0] = dbf1;
		dbTableFields[1] = dbf2;
		dbTableFields[2] = dbf3;
		dbTableFields[3] = dbf4;
		dbTableFields[4] = dbf5;
		dbe.setDbTableFields(dbTableFields);
		return dbe;
	}
	
	

	private static DbDataTable createEquipment() {
		DbDataTable dbe = new DbDataTable();
		dbe.setDbTableName("FARM_EQUIPMENT");
		dbe.setDbRepoName(CONST_MASTER_REPO);
		dbe.setDbSchema(CONST_DEFAULT_SCHEMA);
		dbe.setIsSystemTable(false);
		dbe.setIsRepoTable(false);
		dbe.setLabel_code("master_repo.farm_equipment");
		dbe.setUse_cache(false);
		dbe.setIsConfigTable(false);
		dbe.setParentName(CONST_FARMER);

		// Column 1
		DbDataField dbf1 = new DbDataField();
		dbf1.setDbFieldName("PKID");
		dbf1.setIsPrimaryKey(true);
		dbf1.setDbFieldType(DbFieldType.NUMERIC);
		dbf1.setDbFieldSize(18);
		dbf1.setDbFieldScale(0);
		dbf1.setIsNull(false);
		dbf1.setLabel_code("master_repo.table_meta_pkid");

		// Column 2
		DbDataField dbf2 = new DbDataField();
		dbf2.setDbFieldName("EQUIPMENT_REG_PLATE");
		dbf2.setDbFieldType(DbFieldType.NVARCHAR);
		dbf2.setDbFieldSize(20);
		dbf2.setIsNull(true);
		dbf2.setLabel_code("farm_equipment.equipment_reg_plate");
		dbf2.setSort_order(10002);

		// Column 3
		DbDataField dbf3 = new DbDataField();
		dbf3.setDbFieldName("EQUIPMENT_TYPE");
		dbf3.setDbFieldType(DbFieldType.NVARCHAR);
		dbf3.setCode_list_user_code("FARM_EQUIPMENT_TYPE");
		dbf3.setDbFieldSize(10);
		dbf3.setIsNull(false);
		dbf3.setLabel_code("farm_equipment.equipment_type");
		dbf3.setSort_order(10003);

		// Column 4
		DbDataField dbf4 = new DbDataField();
		dbf4.setDbFieldName("PRODUCTION_YEAR");
		dbf4.setDbFieldType(DbFieldType.NUMERIC);
		dbf4.setDbFieldSize(4);
		dbf4.setIsNull(false);
		dbf4.setLabel_code("farm_equipment.production_year");
		dbf4.setSort_order(10004);

		// Column 5
		DbDataField dbf5 = new DbDataField();
		dbf5.setDbFieldName("ENGINE_POWER");
		dbf5.setDbFieldType(DbFieldType.NUMERIC);
		dbf5.setDbFieldSize(12);
		dbf5.setIsNull(true);
		dbf5.setLabel_code("farm_equipment.engine_power");

		DbDataField[] dbTableFields = new DbDataField[5];
		dbTableFields[0] = dbf1;
		dbTableFields[1] = dbf2;
		dbTableFields[2] = dbf3;
		dbTableFields[3] = dbf4;
		dbTableFields[4] = dbf5;
		dbe.setDbTableFields(dbTableFields);
		return dbe;
	}

}
