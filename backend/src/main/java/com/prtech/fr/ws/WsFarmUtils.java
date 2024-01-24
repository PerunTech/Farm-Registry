package com.prtech.fr.ws;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;

import org.apache.logging.log4j.Logger;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.prtech.perun.PerunUtil;
import com.prtech.perun_core.ws.WsReactElements;
import com.prtech.svarog.I18n;
import com.prtech.svarog.SvConf;
import com.prtech.svarog.SvCore;
import com.prtech.svarog.SvException;
import com.prtech.svarog.SvExecManager;
import com.prtech.svarog.SvReader;
import com.prtech.svarog_common.DbDataArray;
import com.prtech.svarog_common.DbDataObject;
import com.prtech.svarog_common.DbSearchCriterion;
import com.prtech.svarog_common.DbSearchCriterion.DbCompareOperand;
import com.prtech.svarog_common.DbSearchExpression;
import com.prtech.svarog_common.ResponseHandler;
import com.prtech.svarog_common.ResponseHandler.MessageType;

@Path("/WsFarmUtils")
public class WsFarmUtils {

	static final Logger log4j = SvConf.getLogger(WsFarmUtils.class);

	/**
	 * Method for finding locale id per user, If not set returns default
	 * 
	 * @param svr SvReader instance
	 */

	public static String getLocaleId(SvReader svr) {
		String locale = SvConf.getDefaultLocale();
		try {
			DbDataObject dboLocale = svr.getUserLocale(svr.getInstanceUser());
			if (dboLocale != null && dboLocale.getVal("LOCALE_ID").toString() != null) {
				locale = dboLocale.getVal("LOCALE_ID").toString();
			}
		} catch (SvException e) {
			log4j.error(e.getFormattedMessage(), e);
		}
		return locale;
	}

	/**
	 * Web service to return all animals relating to a farm record.
	 * 
	 * @param sessionId   Session ID (SID) of the web communication between browser
	 *                    and web server
	 * @param animal_type String table from which we want to get data
	 * @param farm_id     Long object ID of the farm in question.
	 * @param no_rec      Integer how many records we want to pull from the table
	 * 
	 * @return Json with all animals found
	 */
	@Path("/getAnimals/{session_id}/{animal_type}/{farm_id}/{no_rec}")
	@GET
	@Produces("application/json")
	public Response getAnimals(@PathParam("session_id") String sessionId, @PathParam("animal_type") String animalType,
			@PathParam("farm_id") Long farmId, @PathParam("no_rec") Integer recordNumber,
			@Context HttpServletRequest httpRequest) {
		String retString = "";
		String[] tablesUsedArray = new String[1];
		Boolean[] tableShowArray = new Boolean[1];
		int tablesusedCount = 1;
		switch (animalType) {
		case "SINGLE":
			tablesUsedArray[0] = "AHV_SINGLE_ANIMAL";
			break;
		case "GROUP":
			tablesUsedArray[0] = "AHV_ANIMAL_GROUP";
			break;
		}
		try (SvReader svr = new SvReader(sessionId)) {
			LinkedHashMap<String, String> mapFieldDenormalizedField = new LinkedHashMap<>();
			DbSearchCriterion crit1 = new DbSearchCriterion();
			DbSearchExpression dbse = new DbSearchExpression();
			DbDataArray holdings = svr.getObjectsByParentId(farmId, SvCore.getTypeIdByName("AHV_HOLDING"), null);
			if (null != holdings && !holdings.isEmpty()) {
				for (DbDataObject holding : holdings.getItems()) {
					crit1 = new DbSearchCriterion("PARENT_ID", DbCompareOperand.EQUAL, holding.getObjectId());
					crit1.setNextCritOperand("OR");
					dbse.addDbSearchItem(crit1);
				}
				DbDataArray vData = svr.getObjects(dbse, SvCore.getTypeIdByName(tablesUsedArray[0]), null, recordNumber,
						null);
				tableShowArray[0] = true;
				retString = WsReactElements.prapareTableQueryData(vData, tablesUsedArray, tableShowArray,
						tablesusedCount, true, mapFieldDenormalizedField, svr);
			} else {
				DbDataArray vData = new DbDataArray();
				tableShowArray[0] = true;
				retString = WsReactElements.prapareTableQueryData(vData, tablesUsedArray, tableShowArray,
						tablesusedCount, true, mapFieldDenormalizedField, svr);
			}
		} catch (SvException e) {
			log4j.error(e.getFormattedMessage(), e);
			return PerunUtil.handleException(e, "Error getting animals relating to a farm record");
		}
		return Response.status(200).entity(retString).build();
	}

	@Path("/getFarmLpisData/{session_id}/{include_geometries}/{farm_id}")
	@GET
	@Produces("application/json")
	public Response getFarmLpisData(@PathParam("session_id") String sessionId,
			@PathParam("include_geometries") Boolean include_geometries, @PathParam("farm_id") Long farmId,
			@Context HttpServletRequest httpRequest) {
		ResponseHandler jrh = new ResponseHandler();
		JsonArray jsonArrayResponse = new JsonArray();
		try (SvExecManager svsec = new SvExecManager(sessionId); SvReader svr = new SvReader(svsec);) {
			Map<String, Object> params = new HashMap<String, Object>();
			params.put("FARM_ID", farmId);
			params.put("REFERENCE_DATE", null);
			params.put("INCLUDE_GEOMETRIES", include_geometries);
			DbDataArray vData = (DbDataArray) svsec.execute("LPIS.PARCELS", params, null);
			String[] tablesUsedArray = new String[1];
			Boolean[] tableShowArray = new Boolean[1];
			int tablesusedCount = 1;
			tablesUsedArray[0] = "AGRI_PARCEL";
			tableShowArray[0] = true;
			LinkedHashMap<String, String> mapFieldDenormalizedField = new LinkedHashMap<>();
			jsonArrayResponse = WsReactElements.prapareTableQueryData(vData, tablesUsedArray, tableShowArray,
					tablesusedCount, true, svr, false, mapFieldDenormalizedField);
			jrh.create(MessageType.SUCCESS, I18n.getText("success"), I18n.getText("success"), jsonArrayResponse);
		} catch (SvException e) {
			log4j.error(e.getFormattedMessage(), e);
			return PerunUtil.handleException(e, "Error getting lpis data");
		}
		return Response.status(200).entity(jrh.getAll().toString()).build();
	}

	@Path("/getIntersectionsData/{session_id}/{farm_id}")
	@GET
	@Produces("application/json")
	public Response getIntersectionsData(@PathParam("session_id") String sessionId, @PathParam("farm_id") Long farmId,
			@Context HttpServletRequest httpRequest) {
		ResponseHandler jrh = new ResponseHandler();
		JsonObject jsonObjectResponse = new JsonObject();
		try (SvExecManager svsec = new SvExecManager(sessionId); SvReader svr = new SvReader(svsec);) {
			String localeId = getLocaleId(svr);
			Map<String, Object> params = new HashMap<String, Object>();
			params.put("FARM_ID", farmId);
			params.put("REFERENCE_DATE", null);
			params.put("INCLUDE_GEOMETRIES", false);
			params.put("INTERSECTION_DETAILS", true);
			DbDataArray vData = (DbDataArray) svsec.execute("LPIS.PARCELS", params, null);
			jsonObjectResponse = vData.toSimpleJson();
			JsonArray finalList = new JsonArray();
			for (JsonElement jse : jsonObjectResponse.get("items").getAsJsonArray()) {
				JsonObject jObj = jse.getAsJsonObject();
				JsonObject tmp = new JsonObject();
				tmp.add(I18n.getText(localeId, "agri_parcel.old_id"), jObj.get("OLD_ID"));
				tmp.add(I18n.getText(localeId, "agri_parcel.common_use"), jObj.get("COMMON_USE"));
				tmp.add(I18n.getText(localeId, "agri_parcel.home_name"), jObj.get("HOME_NAME"));
				tmp.add(I18n.getText(localeId, "agri_parcel.land_cover_code"), jObj.get("LAND_COVER_CODE"));
				tmp.add(I18n.getText(localeId, "allowed.area"), jObj.get("ALLOWED_AREA"));
				tmp.add(I18n.getText(localeId, "cad_intersections.MUNICIPALITY_NAME"), jObj.get("MUNICIPALITY_NAME"));
				tmp.add(I18n.getText(localeId, "agri_parcel.GR_PARCEL"), jObj.get("GR_PARCEL"));
				tmp.add(I18n.getText(localeId, "cad_intersections.FR_AREA"), jObj.get("FR_AREA"));
				tmp.add(I18n.getText(localeId, "overlap.area"), jObj.get("OVERLAP_AREA"));
				finalList.add(tmp);
			}
			jrh.create(MessageType.SUCCESS, I18n.getText("success"), I18n.getText("success"), finalList);
		} catch (SvException e) {
			log4j.error(e.getFormattedMessage(), e);
			return PerunUtil.handleException(e, "Error getting intersections data");
		}
		return Response.status(200).entity(jrh.getAll().toString()).build();
	}

	@Path("/getAgriParcelData/{session_id}/{farm_id}")
	@GET
	@Produces("application/json")
	public Response getAgriParcelData(@PathParam("session_id") String sessionId, @PathParam("farm_id") Long farmId,
			@Context HttpServletRequest httpRequest) {
		ResponseHandler jrh = new ResponseHandler();
		JsonObject jsonObjectResponse = new JsonObject();
		try (SvExecManager svsec = new SvExecManager(sessionId); SvReader svr = new SvReader(svsec);) {
			String localeId = getLocaleId(svr);
			Map<String, Object> params = new HashMap<String, Object>();
			params.put("FARM_ID", farmId);
			params.put("REFERENCE_DATE", null);
			params.put("INCLUDE_GEOMETRIES", false);
			params.put("INTERSECTION_DETAILS", false);
			DbDataArray vData = (DbDataArray) svsec.execute("LPIS.PARCELS", params, null);
			jsonObjectResponse = vData.toSimpleJson();
			JsonArray finalList = new JsonArray();
			for (JsonElement jse : jsonObjectResponse.get("items").getAsJsonArray()) {
				JsonObject jObj = jse.getAsJsonObject();
				JsonObject tmp = new JsonObject();
				tmp.add(I18n.getText(localeId, "agri_parcel.old_id"), jObj.get("OLD_ID"));
				tmp.add(I18n.getText(localeId, "allowed.area"), jObj.get("ALLOWED_AREA"));
				tmp.add(I18n.getText(localeId, "common.area"), jObj.get("AREA"));
				tmp.add(I18n.getText(localeId, "agri_parcel.common_use"), jObj.get("COMMON_USE"));
				tmp.add(I18n.getText(localeId, "agri_parcel.certificate_of_use"), jObj.get("CERTIFICATE_OF_USE"));
				tmp.add(I18n.getText(localeId, "agri_parcel.cadastral_municipality"), jObj.get("KO_ID"));
				tmp.add(I18n.getText(localeId, "agri_parcel.home_name"), jObj.get("HOME_NAME"));
				tmp.add(I18n.getText(localeId, "cad_intersections.MUNICIPALITY_NAME"), jObj.get("MUNICIPALITY_NAME"));
				tmp.add(I18n.getText(localeId, "agri_parcel.z_avg"), jObj.get("Z_AVG"));
				finalList.add(tmp);
			}
			jrh.create(MessageType.SUCCESS, I18n.getText("success"), I18n.getText("success"), finalList);
		} catch (SvException e) {
			log4j.error(e.getFormattedMessage(), e);
			return PerunUtil.handleException(e, "Error getting agri parcel data");
		}
		return Response.status(200).entity(jrh.getAll().toString()).build();
	}

	@Path("/getTableFieldListCustom/{session_id}/{table_name}")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getTableFieldList(@PathParam("session_id") String sessionId,
			@PathParam("table_name") String tableName, @Context HttpServletRequest httpRequest) {
		JsonArray jArray = new JsonArray();
		try (SvReader svr = new SvReader(sessionId);) {

			WsReactElements re = new WsReactElements();
			Response responseHtml = re.getTableFieldList(sessionId, tableName, null);
			Gson gson = new Gson();
			jArray = gson.fromJson(responseHtml.getEntity().toString(), JsonArray.class);

			DbDataObject tableObject = SvCore.getDbtByName(tableName);

			if (tableObject.getVal("GUI_METADATA") != null) {
				JsonObject guiMetadata = null;
				JsonArray jsonFields = null;

				if (tableObject.getVal("GUI_METADATA") != null)
					guiMetadata = (new Gson()).fromJson(tableObject.getVal("GUI_METADATA").toString(),
							JsonObject.class);
				if (guiMetadata != null && guiMetadata.has("extra_field_list"))
					jsonFields = (JsonArray) guiMetadata.get("extra_field_list");

				if (jsonFields != null) {
					String localeId = getLocaleId(svr);
					for (int i = 0; i < jsonFields.size(); i++) {
						JsonObject jsonField = jsonFields.get(i).getAsJsonObject();
						if (jsonField.has("name")) {
							jsonField.addProperty("name", I18n.getText(localeId, jsonField.get("name").getAsString()));
						}
						jArray.add(jsonField);
					}
				}
			}
		} catch (SvException e) {
			return PerunUtil.handleException(e, "Error getting table field list");
		}
		return Response.status(200).entity(jArray.toString()).build();
	}

	@Path("/getTableSearchJSONSchemaCustom/{session_id}/{table_name}")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getTableSearchJSONSchema(@PathParam("session_id") String sessionId,
			@PathParam("table_name") String tableName, @Context HttpServletRequest httpRequest) {
		JsonObject jData = new JsonObject();
		try (SvReader svr = new SvReader(sessionId);) {
			String defaultField = "";
			String localeId = getLocaleId(svr);
			DbDataObject table = SvCore.getDbtByName(tableName);
			jData.addProperty("title", I18n.getText(getLocaleId(svr), table.getVal("LABEL_CODE").toString()));
			jData.addProperty("type", "object");

			JsonObject properties = new JsonObject();
			JsonObject searchFormCriteria = new JsonObject();
			searchFormCriteria.addProperty("type", "string");
			searchFormCriteria.addProperty("title", I18n.getText(localeId, "search_form_by_criteria.criteria"));

			JsonObject searchFormValue = new JsonObject();
			searchFormValue.addProperty("type", "string");
			searchFormValue.addProperty("title", I18n.getText(localeId, "search_form_by_criteria.value"));

			if (table.getVal("GUI_METADATA") != null) {
				JsonObject guiMetadata = null;
				JsonArray criterias = null;

				if (table.getVal("GUI_METADATA") != null)
					guiMetadata = (new Gson()).fromJson(table.getVal("GUI_METADATA").toString(), JsonObject.class);
				if (guiMetadata != null && guiMetadata.has("search_form_by_criteria"))
					criterias = (JsonArray) guiMetadata.get("search_form_by_criteria");

				if (criterias != null) {
					ArrayList<String> enumNames = new ArrayList<>();
					ArrayList<String> enums = new ArrayList<>();

					for (int i = 0; i < criterias.size(); i++) {
						JsonObject jsonField = criterias.get(i).getAsJsonObject();
						if (jsonField.has("enum") && jsonField.has("name")) {
							jsonField.addProperty("name", I18n.getText(localeId, jsonField.get("name").getAsString()));
							enumNames.add(I18n.getText(localeId, jsonField.get("name").getAsString()));
							enums.add(jsonField.get("enum").getAsString());
						}
						if (jsonField.has("default")) {
							defaultField = jsonField.get("default").getAsString();
						}
					}
					Gson gson = new Gson();
					JsonElement enumsElem = gson.toJsonTree(enums);
					JsonElement enumNamesElem = gson.toJsonTree(enumNames);
					searchFormCriteria.add("enum", enumsElem);
					searchFormCriteria.add("enumNames", enumNamesElem);
					if (!defaultField.equals("")) {
						searchFormCriteria.addProperty("default", defaultField);
					}
				}
			}

			properties.add("SEARCH_OPTION", searchFormCriteria);
			properties.add("SEARCH_VALUES", searchFormValue);
			jData.add("properties", properties);
		} catch (SvException e) {
			return PerunUtil.handleException(e, "Error getting table field list");
		}
		return Response.status(200).entity(jData.toString()).build();
	}

	@Path("/LandUseCodes/get/{sessionId}/landCover/{landCover}/baseOnly/{includeOnlyBasic}/year/{year}/includeOtscCrops/{includeOtscCrops}")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getLandUseCodes(@PathParam("sessionId") String sessionId, @PathParam("landCover") Integer landCover,
			@PathParam("includeOnlyBasic") Boolean includeOnlyBasic, @PathParam("year") Integer year,
			@PathParam("includeOtscCrops") Boolean includeOtscCrops, @Context HttpServletRequest httpRequest) {
		JsonObject jObjectResult = new JsonObject();
		try (SvReader svr = new SvReader(sessionId);) {
			DbReader rdr = new DbReader();
			jObjectResult = rdr.getSpecificLandUseCodesMainMethod(svr, year, landCover, includeOnlyBasic,
					includeOtscCrops);
		} catch (Exception e) {
			return PerunUtil.handleException(e, "Error getting land use codes");
		}
		return Response.status(200).entity(jObjectResult.toString()).build();
	}

	@Path("/search-farm-person/sid/{sessionId}")
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	public Response searchFarmPersonData(@PathParam("sessionId") String sessionId,
			MultivaluedMap<String, String> formVals, @Context HttpServletRequest httpRequest) {
		JsonArray jObjectResult = new JsonArray();
		try (SvReader svr = new SvReader(sessionId);) {
			JsonObject jsonData = null;
			if (formVals != null)
				for (Entry<String, List<String>> entry : formVals.entrySet()) {
					if (entry.getKey() != null && !entry.getKey().isEmpty()) {
						String key = entry.getKey();
						jsonData = new Gson().fromJson(key, JsonObject.class);
					}
				}

			if (jsonData != null && jsonData.has("SEARCH_OPTION") && jsonData.has("SEARCH_VALUES")) {
				DbReader rdr = new DbReader();
				DbDataArray foundData = rdr.searchFarmAndPersonData(jsonData.get("SEARCH_OPTION").getAsString(),
						jsonData.get("SEARCH_VALUES").getAsString(), svr);
				if (foundData != null && !foundData.isEmpty()) {
					String[] tables = { CC.FARM, CC.PERSON };
					jObjectResult = rdr.convertDataArrayToJsonArray(foundData, tables);
				}
			}
		} catch (Exception e) {
			return PerunUtil.handleException(e, "Error getting farm and person data");
		}
		return Response.status(200).entity(jObjectResult.toString()).build();
	}
}
