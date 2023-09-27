package com.prtech.fr.ws;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;
import org.apache.logging.log4j.Logger;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.prtech.svarog.CodeList;
import com.prtech.svarog.I18n;
import com.prtech.svarog.SvConf;
import com.prtech.svarog.SvCore;
import com.prtech.svarog.SvException;
import com.prtech.svarog.SvReader;
import com.prtech.svarog.svCONST;
import com.prtech.svarog_common.DbDataArray;
import com.prtech.svarog_common.DbDataObject;
import com.prtech.svarog_common.DbQueryExpression;
import com.prtech.svarog_common.DbQueryObject;
import com.prtech.svarog_common.DbSearchCriterion;
import com.prtech.svarog_common.DbSearchExpression;
import com.prtech.svarog_common.DbQueryObject.DbJoinType;
import com.prtech.svarog_common.DbQueryObject.LinkType;
import com.prtech.svarog_common.DbSearch.DbLogicOperand;
import com.prtech.svarog_common.DbSearchCriterion.DbCompareOperand;

/**
 * @author zpetr
 *
 */
/**
 * @author zpetr
 *
 */
public class DbReader {

	static final Logger log4j = SvConf.getLogger(DbReader.class);

	private static String getLocaleId(SvReader svr) {
		String locale = SvConf.getDefaultLocale();
		try {
			locale = svr.getUserLocaleId(svr.getInstanceUser());
		} catch (SvException e) {
			log4j.error(e.getFormattedMessage(), e);
		}
		return locale;
	}

	/**
	 * Simple help method for fetching DB object by single filter
	 * 
	 * @param objectType
	 * @param columnName
	 * @param columnValue
	 * @param svr
	 * @return
	 * @throws SvException
	 */
	public DbDataObject searchDbObjectBySingleFilter(Long objectType, String columnName, Object columnValue,
			SvReader svr) {
		return searchDbObjectBySingleFilter(DbCompareOperand.EQUAL, objectType, columnName, columnValue, svr);
	}

	Map<String, JsonObject> landUseCache = new HashMap<>();

	/**
	 * Simple method for searching object by single filter
	 * 
	 * @param objectType
	 * @param columnName
	 * @param value
	 * @param svr
	 * @return
	 */
	public DbDataObject searchDbObjectBySingleFilter(DbCompareOperand operand, Long objectType, String columnName,
			Object value, SvReader svr) {
		DbDataObject dbo = null;
		try {
			DbSearchCriterion cr1 = new DbSearchCriterion(columnName, operand, value);
			DbDataArray arrFoundDbObjects = svr.getObjects(cr1, objectType, null, 1, 0);
			if (!arrFoundDbObjects.isEmpty()) {
				dbo = arrFoundDbObjects.get(0);
			}
		} catch (SvException e) {
			log4j.error(e);
		}
		return dbo;
	}

	public JsonObject getSpecificLandUseCodesMainMethod(SvReader svr, Integer year, Integer landCover,
			Boolean includeOnlyBasic, Boolean includeOtscCrops) throws SvException {
		JsonObject jObjectResult = new JsonObject();
		DbReader reader = new DbReader();
		Integer minYear = 2021;
		if (minYear.compareTo(year) >= 0) {
			if (landCover < 1) {
				jObjectResult = reader.getAllLandUseCodes(includeOnlyBasic, svr);
			} else {
				jObjectResult = reader.getDependentLandUseCodes(landCover.toString(), includeOnlyBasic,
						includeOtscCrops, svr);
			}
		} else {
			String listId = landCover.toString() + includeOnlyBasic.toString() + includeOtscCrops.toString()
					+ year.longValue();

			if (!landUseCache.containsKey(listId)) {
				synchronized (landUseCache) {
					if (!landUseCache.containsKey(listId)) {
						jObjectResult = reader.getDependentLandUseCodesPerYear(landCover.toString(), includeOnlyBasic,
								includeOtscCrops, year.longValue(), svr);
						landUseCache.put(listId, jObjectResult);
					}
				}
			}
			jObjectResult = landUseCache.get(listId);
		}
		return jObjectResult;
	}

	public DbDataArray getCodeListByParentCodeValue(String parentCode, SvReader svr) throws SvException {
		DbSearchCriterion crit = new DbSearchCriterion(CC.PARENT_CODE_VALUE, DbCompareOperand.EQUAL, parentCode);
		return svr.getObjects(crit, svCONST.OBJECT_TYPE_CODE, null, 0, 0);

	}

	public ArrayList<DbDataObject> getAllLandUseCodes(SvReader svr) throws SvException {
		return svr.getObjectsByTypeId(SvCore.getTypeIdByName(CC.LAND_USE_CODE), null, 0, 0)
				.getSortedItems(CC.LAND_USE_DESCRIPTION);
	}

	public JsonObject getAllLandUseCodes(boolean includeOnlyBasic, SvReader svr) throws SvException {
		JsonObject jLandUseCodes = new JsonObject();
		ArrayList<Long> arrayEnums = new ArrayList<>();
		ArrayList<String> arrayEnumNames = new ArrayList<>();
		ArrayList<DbDataObject> dbaAllLandUseCodes = getAllLandUseCodes(svr);
		for (DbDataObject dbo : dbaAllLandUseCodes) {
			Long landUseCode = (Long) dbo.getVal(CC.LAND_USE_CODE);
			String landUseDesc = dbo.getVal(CC.LAND_USE_DESCRIPTION).toString();
			if (!includeOnlyBasic) {
				arrayEnums.add(Long.valueOf(landUseCode));
				arrayEnumNames.add(landUseDesc);
			} else {
				if (dbo.getVal(CC.BASIC_LAND_USE_CODE).equals(landUseCode.toString())) {
					arrayEnums.add(Long.valueOf(landUseCode));
					arrayEnumNames.add(landUseDesc);
				}
			}
		}
		if (!arrayEnums.isEmpty()) {
			jLandUseCodes.add("enum", (new Gson()).toJsonTree(arrayEnums).getAsJsonArray());
			jLandUseCodes.add("enumNames", (new Gson()).toJsonTree(arrayEnumNames).getAsJsonArray());
		}
		return jLandUseCodes;
	}

	/**
	 * Method that returns list of all land use codes
	 * 
	 * @param landCover
	 * @param svr
	 * @return
	 * @throws SvException
	 */
	public JsonObject getDependentLandUseCodes(String landCover, boolean includeOnlyBasic,
			boolean includeControlSpecificLU, SvReader svr) throws SvException {
		JsonObject jBasicLandUseCodes = new JsonObject();
		DbDataObject dboParentCode = searchDbObjectBySingleFilter(svCONST.OBJECT_TYPE_CODE, CC.CODE_VALUE,
				"LANDUSE_COVER_" + landCover, svr);
		ArrayList<Long> arrayEnums = new ArrayList<>();
		ArrayList<String> arrayEnumNames = new ArrayList<>();
		if (dboParentCode != null) {
			try (CodeList cl = new CodeList(svr)) {
				HashMap<String, String> mapCodeValues = cl.getCodeList(getLocaleId(svr), dboParentCode.getObjectId(),
						true);
				if (!mapCodeValues.isEmpty()) {
					Map<String, String> mapSortedByValue = mapCodeValues.entrySet().stream()
							.sorted(Map.Entry.<String, String>comparingByValue()).collect(Collectors
									.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1, LinkedHashMap::new));

					for (Map.Entry<String, String> entry : mapSortedByValue.entrySet()) {
						String key = entry.getKey();
						String value = entry.getValue();
						if (!includeOnlyBasic) {
							arrayEnums.add(Long.valueOf(key));
							arrayEnumNames.add(value);
						} else {
							if (includeControlSpecificLU) {
								DbDataObject dboControlSpecificLandUseCode = searchDbObjectBySingleFilter(
										SvCore.getTypeIdByName(CC.LAND_USE_CODE), CC.LAND_USE_CODE, key, svr);
								if (dboControlSpecificLandUseCode != null
										&& dboControlSpecificLandUseCode.getVal(CC.BASIC_LAND_USE_CODE) != null
										&& dboControlSpecificLandUseCode.getVal(CC.BASIC_LAND_USE_CODE).equals("-1")) {
									arrayEnums.add((Long) dboControlSpecificLandUseCode.getVal(CC.LAND_USE_CODE));
									arrayEnumNames.add(
											dboControlSpecificLandUseCode.getVal(CC.LAND_USE_DESCRIPTION).toString());
								}
							}
							DbDataObject dboBasicLandUseCode = searchDbObjectBySingleFilter(
									SvCore.getTypeIdByName(CC.LAND_USE_CODE), CC.BASIC_LAND_USE_CODE, key, svr);
							if (dboBasicLandUseCode != null) {
								arrayEnums.add(Long.valueOf(key));
								arrayEnumNames.add(value);
							}
						}
					}
					if (!arrayEnums.isEmpty()) {
						jBasicLandUseCodes.add("enum", (new Gson()).toJsonTree(arrayEnums).getAsJsonArray());
						jBasicLandUseCodes.add("enumNames", (new Gson()).toJsonTree(arrayEnumNames).getAsJsonArray());
					}
				}
			}
		}
		return jBasicLandUseCodes;
	}

	/**
	 * Method that returns list of all land use codes
	 * 
	 * @param landCover
	 * @param svr
	 * @return
	 * @throws SvException
	 */
	public JsonObject getDependentLandUseCodesPerYear(String landCover, boolean includeOnlyBasic,
			boolean includeControlSpecificLU, Long year, SvReader svr) throws SvException {
		JsonObject jBasicLandUseCodes = new JsonObject();
		DbSearchExpression exp1 = new DbSearchExpression();
		DbSearchCriterion sluy1 = new DbSearchCriterion(CC.LAND_COVER_CODE, DbCompareOperand.EQUAL, landCover);
		sluy1.setNextCritOperand(DbLogicOperand.AND.toString());
		DbSearchCriterion sluy2 = new DbSearchCriterion(CC.YEAR, DbCompareOperand.EQUAL, year);
		exp1.addDbSearchItem(sluy1);
		exp1.addDbSearchItem(sluy2);
		DbQueryObject qLandUseYear = new DbQueryObject(SvCore.getDbtByName(CC.LAND_USE_YEAR), exp1, DbJoinType.INNER,
				null, LinkType.CUSTOM, null, null);
		qLandUseYear.addCustomJoinLeft("LAND_USE_OBJECT_ID");
		qLandUseYear.addCustomJoinRight(CC.OBJECT_ID);
		DbQueryObject qLandUseCode = new DbQueryObject(SvCore.getDbtByName(CC.LAND_USE_CODE), null, DbJoinType.INNER,
				null, LinkType.CUSTOM_FREETEXT, null, null);
		qLandUseCode.setCustomFreeTextJoin(" on TO_CHAR(tbl1.land_use_code) = tbl2.code_value");
		DbSearchCriterion scCodeParent = new DbSearchCriterion(CC.PARENT_CODE_VALUE, DbCompareOperand.EQUAL,
				CC.CROP_CODE);
		DbQueryObject qSvarogCode = new DbQueryObject(SvCore.getDbtByName(CC.SVAROG_CODES), scCodeParent,
				DbJoinType.INNER, null, null, null, null);
		qLandUseCode.setIsReturnType(true);
		qSvarogCode.setIsReturnType(true);
		DbQueryExpression dqe = new DbQueryExpression();
		dqe.addItem(qLandUseYear);
		dqe.addItem(qLandUseCode);
		dqe.addItem(qSvarogCode);
		DbDataArray result = svr.getObjects(dqe, null, null);
		HashMap<String, String> mapCodeValues = new HashMap<String, String>();
		String localeId = svr.getUserLocaleId(svr.getInstanceUser());

		if (result != null && !result.getItems().isEmpty())
			for (DbDataObject item : result.getItems())
				if (item.getVal("TBL1_LAND_USE_CODE") != null && item.getVal("TBL2_LABEL_CODE") != null) {
					if (item.getVal("TBL1_" + CC.BASIC_LAND_USE_CODE) != null
							&& item.getVal("TBL1_" + CC.BASIC_LAND_USE_CODE).equals("-1") && !includeControlSpecificLU)
						continue;

					mapCodeValues.put(item.getVal("TBL1_LAND_USE_CODE").toString(),
							I18n.getText(localeId, item.getVal("TBL2_LABEL_CODE").toString()));
				}
		ArrayList<Long> arrayEnums = new ArrayList<>();
		ArrayList<String> arrayEnumNames = new ArrayList<>();
		if (!mapCodeValues.isEmpty()) {
			Map<String, String> mapSortedByValue = mapCodeValues.entrySet().stream()
					.sorted(Map.Entry.<String, String>comparingByValue()).collect(Collectors.toMap(Map.Entry::getKey,
							Map.Entry::getValue, (e1, e2) -> e1, LinkedHashMap::new));

			for (Map.Entry<String, String> entry : mapSortedByValue.entrySet()) {
				String key = entry.getKey();
				String value = entry.getValue();
				if (!includeOnlyBasic) {
					arrayEnums.add(Long.valueOf(key));
					arrayEnumNames.add(value);
				} else {
					if (includeControlSpecificLU) {
						DbDataObject dboControlSpecificLandUseCode = searchDbObjectBySingleFilter(
								SvCore.getTypeIdByName(CC.LAND_USE_CODE), CC.LAND_USE_CODE, key, svr);
						if (dboControlSpecificLandUseCode != null
								&& dboControlSpecificLandUseCode.getVal(CC.BASIC_LAND_USE_CODE) != null
								&& dboControlSpecificLandUseCode.getVal(CC.BASIC_LAND_USE_CODE).equals("-1")) {
							arrayEnums.add((Long) dboControlSpecificLandUseCode.getVal(CC.LAND_USE_CODE));
							arrayEnumNames
									.add(dboControlSpecificLandUseCode.getVal(CC.LAND_USE_DESCRIPTION).toString());
						}
					}
					DbDataObject dboBasicLandUseCode = searchDbObjectBySingleFilter(
							SvCore.getTypeIdByName(CC.LAND_USE_CODE), CC.BASIC_LAND_USE_CODE, key, svr);
					if (dboBasicLandUseCode != null) {
						arrayEnums.add(Long.valueOf(key));
						arrayEnumNames.add(value);
					}
				}
			}
			if (!arrayEnums.isEmpty()) {
				jBasicLandUseCodes.add("enum", (new Gson()).toJsonTree(arrayEnums).getAsJsonArray());
				jBasicLandUseCodes.add("enumNames", (new Gson()).toJsonTree(arrayEnumNames).getAsJsonArray());
			}
		}
		return jBasicLandUseCodes;
	}
}
