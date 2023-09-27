package com.prtech.fr.ws;

import java.util.List;
import java.util.Map.Entry;
import java.util.Random;
import java.util.concurrent.locks.ReentrantLock;
import java.util.stream.LongStream;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.joda.time.DateTime;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.prtech.svarog.I18n;
import com.prtech.svarog.SvCore;
import com.prtech.svarog.SvException;
import com.prtech.svarog.SvLock;
import com.prtech.svarog.SvReader;
import com.prtech.svarog.SvSecurity;
import com.prtech.svarog.SvSequence;
import com.prtech.svarog.SvUtil;
import com.prtech.svarog.SvWriter;
import com.prtech.svarog_common.DbDataArray;
import com.prtech.svarog_common.DbDataObject;
import com.prtech.svarog_common.ResponseHandler;
import com.prtech.svarog_common.ResponseHandler.MessageType;

@Path("/WsRegistration")
public class WsRegistration {

	static final Logger log4j = LogManager.getLogger(WsRegistration.class.getName());

	/**
	 * save farm f.r
	 * 
	 */
	@Path("/saveFarm/{session_id}")
	@POST
	@Produces("application/json")
	public Response saveFarm(@PathParam("session_id") String session, MultivaluedMap<String, String> formVals,
			@Context HttpServletRequest httpRequest) throws SvException {
		ResponseHandler jrh = new ResponseHandler();
		DbDataObject dbG = null;

		try (SvReader svr = new SvReader(session); SvWriter svw = new SvWriter(svr);) {
			dbG = new DbDataObject();
			if (formVals != null) {
				for (Entry<String, List<String>> entry : formVals.entrySet()) {
					if (entry.getKey() != null && !entry.getKey().isEmpty()) {
						String key = entry.getKey();
						JsonObject jobj = new JsonObject();
						Gson gs = new Gson();
						jobj = gs.fromJson(key, JsonObject.class);

						if (jobj.get("FARM_TYPE") != null)
							dbG.setVal("FARM_TYPE", jobj.get("FARM_TYPE").getAsInt());
						if (jobj.get("ORGANIC") != null)
							dbG.setVal("ORGANIC", jobj.get("ORGANIC").getAsInt());
						if (jobj.get("FARM_MEMBERS") != null)
							dbG.setVal("FARM_MEMBERS", jobj.get("FARM_MEMBERS").getAsInt());
						if (jobj.get("FULL_NAME") != null)
							dbG.setVal("FULL_NAME", jobj.get("FULL_NAME").getAsString());
						if (jobj.get("OFFICIAL_CONTACT_OBJ_ID") != null)
							dbG.setVal("OFFICIAL_CONTACT_OBJ_ID", jobj.get("OFFICIAL_CONTACT_OBJ_ID").getAsInt());
						if (jobj.get("PERSON_OBJECT_ID") != null)
							dbG.setVal("PERSON_OBJECT_ID", jobj.get("PERSON_OBJECT_ID").getAsLong());
						if (jobj.get("ARCHIVE_NUMBER") != null)
							dbG.setVal("ARCHIVE_NUMBER", jobj.get("ARCHIVE_NUMBER").getAsLong());

						dbG.setObjectType(SvReader.getTypeIdByName("FARM"));
						dbG.setStatus("PENDING");

						Boolean canSave = false;
						while (!canSave) {
							try {
								String fic = generateFic(svr);
								if (fic != null)
									dbG.setVal("FIC", fic);

								svw.saveObject(dbG, false);
								canSave = true;
								svw.dbCommit();
							} catch (SvException e) {
								System.out.println(e.getLabelCode());
								if (e.getLabelCode().equals("system.error.unq_constraint_violated")) {
									canSave = false;
								} else {
									jrh.create(MessageType.ERROR, I18n.getText(e.getLabelCode()),
											I18n.getText(e.getLabelCode()), new JsonObject());
									return Response.status(200).entity(jrh.getAll().toString()).build();
								}
							}
						}
					}
				}

				jrh.create(MessageType.SUCCESS, I18n.getText("saveUser.success.saveUser"),
						I18n.getText("saveUser.success.saveUser"), dbG.toSimpleJson());
			}
		} catch (SvException e) {
			if (e.getLabelCode().equals("error.invalid_session")) {
				jrh.create(MessageType.ERROR, I18n.getText("error.invalid_session"),
						I18n.getText("error.invalid_session"), new JsonObject());
				return Response.status(401).entity(jrh.getAll().toString()).build();
			}
			jrh.create(MessageType.ERROR, I18n.getText(e.getLabelCode()), I18n.getText(e.getLabelCode()),
					new JsonObject());
			return Response.status(200).entity(jrh.getAll().toString()).build();
		}
		return Response.status(200).entity(jrh.getAll().toString()).build();
	}

	/**
	 * save farm f.r
	 * 
	 */
	@Path("/saveFarmMembers/{session_id}/{farmObjId}")
	@POST
	@Produces("application/json")
	public Response saveFarmMembers(@PathParam("session_id") String session, @PathParam("farmObjId") Long farmObjId,
			MultivaluedMap<String, String> formVals, @Context HttpServletRequest httpRequest) throws SvException {
		ResponseHandler jrh = new ResponseHandler();

		SvWriter svw = null;
		SvReader svr = null;
		DbDataObject dbG = null;

		try {
			svr = new SvReader(session);
			svw = new SvWriter(session);
			dbG = new DbDataObject();
			if (formVals != null) {
				for (Entry<String, List<String>> entry : formVals.entrySet()) {
					if (entry.getKey() != null && !entry.getKey().isEmpty()) {
						String key = entry.getKey();
						JsonObject jobj = new JsonObject();
						Gson gs = new Gson();
						jobj = gs.fromJson(key, JsonObject.class);

						/*
						 * search criteria with parent id farm and denom from person_object_id to check
						 * if farm holding already exist f.r
						 */

						if (jobj.get("FARM_HOLDING_STATUS") != null)
							dbG.setVal("FARM_HOLDING_STATUS", jobj.get("FARM_HOLDING_STATUS").getAsBoolean());
						if (jobj.get("WORK") != null)
							dbG.setVal("WORK", jobj.get("WORK").getAsString());
						if (jobj.get("FULL_NAME") != null)
							dbG.setVal("FULL_NAME", jobj.get("FULL_NAME").getAsString());
						if (jobj.get("EDUCATION") != null)
							dbG.setVal("EDUCATION", jobj.get("EDUCATION").getAsString());
						if (jobj.get("PERSON_OBJECT_ID") != null)
							dbG.setVal("PERSON_OBJECT_ID", jobj.get("PERSON_OBJECT_ID").getAsLong());

						dbG.setParentId(farmObjId);
						dbG.setObjectType(SvReader.getTypeIdByName("FARM_MEMBERS"));
						dbG.setStatus("VALID");

						svw.saveObject(dbG, false);
						svw.dbCommit();
					}
				}

				jrh.create(MessageType.SUCCESS, I18n.getText("saveFarmMember.success.saveFarmMember"),
						I18n.getText("saveFarmMember.success.saveFarmMember"), new JsonObject());
			}
		} catch (SvException e) {
			if (e.getLabelCode().equals("error.invalid_session")) {
				jrh.create(MessageType.ERROR, I18n.getText("error.invalid_session"),
						I18n.getText("error.invalid_session"), new JsonObject());
				return Response.status(401).entity(jrh.getAll().toString()).build();
			}
			jrh.create(MessageType.ERROR, I18n.getText(e.getLabelCode()), I18n.getText(e.getLabelCode()),
					new JsonObject());
			return Response.status(200).entity(jrh.getAll().toString()).build();
		} finally {
			if (svr != null)
				svr.release();
			if (svw != null)
				svw.release();

		}
		return Response.status(200).entity(jrh.getAll().toString()).build();
	}

	/**
	 * activate farm f.r
	 * 
	 */
	public Response activateFarm(String session, Long farmObjId) throws SvException {
		ResponseHandler jrh = new ResponseHandler();

		SvWriter svw = null;
		SvReader svr = null;
		DbDataObject dbf = null;

		try {
			svr = new SvReader(session);
			svw = new SvWriter(session);
			dbf = new DbDataObject();
			if (farmObjId != null) {
				dbf = svr.getObjectById(farmObjId, SvCore.getTypeIdByName("FARM"), null);
			}

			if (dbf != null) {
				if (!dbf.getStatus().equals("VALID") && !dbf.getStatus().equals("INVALID")
						&& !dbf.getStatus().equals("CLOSED")) {
					dbf.setStatus("VALID");
					svw.saveObject(dbf, false);
					svw.dbCommit();
					jrh.create(MessageType.SUCCESS, I18n.getText("farm.success.farmActivated"),
							I18n.getText("farm.success.farmActivated"), new JsonObject());
				} else {
					jrh.create(MessageType.ERROR, I18n.getText("farm.error.farmAlreadyActivatedOrNotValid"),
							I18n.getText("farm.error.farmAlreadyActivatedOrNotValid"), new JsonObject());
				}
			} else {
				jrh.create(MessageType.ERROR, I18n.getText("farm.error.farmNotFound"),
						I18n.getText("farm.error.farmNotFound"), new JsonObject());
			}
		} catch (SvException e) {
			if (e.getLabelCode().equals("error.invalid_session")) {
				jrh.create(MessageType.ERROR, I18n.getText("error.invalid_session"),
						I18n.getText("error.invalid_session"), new JsonObject());
				return Response.status(401).entity(jrh.getAll().toString()).build();
			}
			jrh.create(MessageType.ERROR, I18n.getText(e.getLabelCode()), I18n.getText(e.getLabelCode()),
					new JsonObject());
			return Response.status(200).entity(jrh.getAll().toString()).build();
		} finally {
			if (svr != null)
				svr.release();
			if (svw != null)
				svw.release();
		}
		return Response.status(200).entity(jrh.getAll().toString()).build();
	}

	/*
	 * build new sequence for FIC current year + seq(next val) f.r
	 */
	public String generateFic(SvCore parentSvr) throws SvException {
		SvSequence svs = null;
		String generateFic = null;
		if (parentSvr != null) {
			try {
				svs = new SvSequence(parentSvr.getSessionId());
				DateTime currDate = new DateTime();
				int currentYear = currDate.getYear();
				String sequenceKey = "GENERATE_FIC" + currentYear;
				String ficSeq = "";

				ReentrantLock lock = null;
				Long seqId = SvSequence.getSeqNextVal(sequenceKey, svs);
				try {
					lock = SvLock.getLock(String.valueOf(seqId), false, 0);
					if (lock == null) {
						throw (new SvException("perun.error.objectUsedByOtherSession", parentSvr.getInstanceUser()));
					}
					ficSeq = String.format("%07d", Integer.valueOf(seqId.toString()));
					generateFic = currentYear + ficSeq;

				} finally {
					if (lock != null) {
						SvLock.releaseLock(String.valueOf(seqId), lock);
					}
				}
			} catch (SvException e) {
				if (e.getLabelCode().equals("error.unique")) {
					return null;
				}
				log4j.error(e);
			} finally {
				if (svs != null)
					svs.release();
			}
		}
		return generateFic;
	}
}
