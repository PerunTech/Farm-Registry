package com.prtech.fr.ws;

import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.logging.log4j.Logger;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
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

	private Response setExceptionResponseHandler(Exception e, ResponseHandler jrh, String message) {
		if (e instanceof SvException) {
			SvException sve = (SvException) e;
			log4j.error(sve.getFormattedMessage(), sve);
			if (sve.getLabelCode().equals(CC.ERROR_INVALID_SESSION)) {
				jrh.create(MessageType.ERROR, I18n.getText(CC.ERROR_INVALID_SESSION),
						I18n.getText(CC.ERROR_INVALID_SESSION), new JsonObject());
				return Response.status(401).entity(jrh.getAll().toString()).build();
			} else if (sve.getLabelCode().equals(CC.ERROR_USER_NOT_AUTHORIZED)) {
				jrh.create(MessageType.ERROR, I18n.getText(CC.ERROR_USER_NOT_AUTHORIZED),
						I18n.getText(CC.ERROR_USER_NOT_AUTHORIZED), new JsonObject());
				return Response.status(403).entity(jrh.getAll().toString()).build();
			} else {
				jrh.create(MessageType.ERROR, I18n.getText(message), I18n.getText(sve.getLabelCode()),
						new JsonObject());
				return Response.status(200).entity(jrh.getAll().toString()).build();
			}
		} else {
			log4j.error(e.getMessage(), e);
			jrh.create(MessageType.ERROR, I18n.getText(message), I18n.getText(message), new JsonObject());
		}
		return Response.status(200).entity(jrh.getAll().toString()).build();
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
			return Response.status(401).entity(e.getFormattedMessage()).build();
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
			return Response.status(401).entity(e.getFormattedMessage()).build();
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
				tmp.add("Број на СИЗП", jObj.get("OLD_ID"));
				tmp.add("Заедничка употреба", jObj.get("COMMON_USE"));
				tmp.add("Место викано", jObj.get("HOME_NAME"));
				tmp.add("Употреба на земјиште", jObj.get("LAND_COVER_CODE"));
				tmp.add("Површина на СИЗП (m²)", jObj.get("ALLOWED_AREA"));
				tmp.add("Катастарска општина", jObj.get("MUNICIPALITY_NAME"));
				tmp.add("Број на КП", jObj.get("GR_PARCEL"));
				tmp.add("Пријавена површина во ЕРЗС", jObj.get("FR_AREA"));
				tmp.add("Површина на графички пресек помеѓу СИЗП и КП", jObj.get("OVERLAP_AREA"));
				finalList.add(tmp);
			}
			jrh.create(MessageType.SUCCESS, I18n.getText("success"), I18n.getText("success"), finalList);
		} catch (SvException e) {
			log4j.error(e.getFormattedMessage(), e);
			return Response.status(401).entity(e.getFormattedMessage()).build();
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
				tmp.add("Број на СИЗП", jObj.get("OLD_ID"));
				tmp.add("Површина", jObj.get("ALLOWED_AREA"));
				tmp.add("Вкупна површина", jObj.get("AREA"));
				tmp.add("Заедничка употреба", jObj.get("COMMON_USE"));
				tmp.add("Право на користење", jObj.get("CERTIFICATE_OF_USE"));
				tmp.add("Број на КО", jObj.get("KO_ID"));
				tmp.add("Место викано", jObj.get("HOME_NAME"));
				tmp.add("Катастарска општина", jObj.get("MUNICIPALITY_NAME"));
				tmp.add("Надморска висина", jObj.get("Z_AVG"));
				finalList.add(tmp);
			}
			jrh.create(MessageType.SUCCESS, I18n.getText("success"), I18n.getText("success"), finalList);
		} catch (SvException e) {
			log4j.error(e.getFormattedMessage(), e);
			return Response.status(401).entity(e.getFormattedMessage()).build();
		}
		return Response.status(200).entity(jrh.getAll().toString()).build();
	}

	@Path("/LandUseCodes/get/{sessionId}/landCover/{landCover}/baseOnly/{includeOnlyBasic}/year/{year}/includeOtscCrops/{includeOtscCrops}")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getLandUseCodes(@PathParam("sessionId") String sessionId, @PathParam("landCover") Integer landCover,
			@PathParam("includeOnlyBasic") Boolean includeOnlyBasic, @PathParam("year") Integer year,
			@PathParam("includeOtscCrops") Boolean includeOtscCrops, @Context HttpServletRequest httpRequest) {
		ResponseHandler jrh = new ResponseHandler();
		JsonObject jObjectResult = new JsonObject();
		try (SvReader svr = new SvReader(sessionId);) {
			DbReader rdr = new DbReader();
			jObjectResult = rdr.getSpecificLandUseCodesMainMethod(svr, year, landCover, includeOnlyBasic,
					includeOtscCrops);
		} catch (Exception e) {
			return setExceptionResponseHandler(e, jrh, "farm_registry.error.get_land_use_codes");
		}
		return Response.status(200).entity(jObjectResult.toString()).build();
	}
}
