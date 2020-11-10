package com.jb4dc.base.service.liquibase;

import liquibase.change.core.LoadDataChange;
import liquibase.database.Database;
import liquibase.database.core.MySQLDatabase;
import liquibase.datatype.DataTypeFactory;
import liquibase.datatype.DataTypeInfo;
import liquibase.datatype.DatabaseDataType;
import liquibase.datatype.core.CharType;

import java.util.Locale;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/11/8
 * To change this template use File | Settings | File Templates.
 */
@DataTypeInfo(name="nvarchar", aliases = {"java.sql.Types.NVARCHAR", "nvarchar2", "national"}, minParameters = 0, maxParameters = 1, priority = 2)
public class NVarcharTypeCust extends CharType {

    @Override
    public DatabaseDataType toDatabaseDataType(Database database) {
        if ((getRawDefinition() != null) && getRawDefinition().toLowerCase(Locale.US).contains("national character varying")) {
            setAdditionalInformation(null); //just go to nvarchar
        }
        if((database instanceof MySQLDatabase)){
            return new DatabaseDataType("VARCHAR", getParameters());
        }
        return DataTypeFactory.getInstance().fromDescription("liquibase.datatype.core.NVarcharType",database).toDatabaseDataType(database);
        //return new NVarcharType().toDatabaseDataType(database);
        /*if ((getRawDefinition() != null) && getRawDefinition().toLowerCase(Locale.US).contains("national character varying")) {
            setAdditionalInformation(null); //just go to nvarchar
        }
        if ((database instanceof HsqlDatabase) || (database instanceof PostgresDatabase) || (database instanceof
                DerbyDatabase)) {

            return new DatabaseDataType("VARCHAR", getParameters());
        }
        if (database instanceof OracleDatabase) {
            return new DatabaseDataType("NVARCHAR2", getParameters());
        }
        if (database instanceof MSSQLDatabase) {
            Object[] parameters = getParameters();
            if (parameters.length > 0) {
                String param1 = parameters[0].toString();
                if (!param1.matches("\\d+") || (new BigInteger(param1).compareTo(BigInteger.valueOf(4000L)) > 0)) {

                    DatabaseDataType type = new DatabaseDataType(database.escapeDataTypeName("nvarchar"), "MAX");
                    type.addAdditionalInformation(getAdditionalInformation());
                    return type;
                }
            }
            if (parameters.length == 0) {
                parameters = new Object[] { 1 };
            } else if (parameters.length > 1) {
                parameters = Arrays.copyOfRange(parameters, 0, 1);
            }
            DatabaseDataType type =  new DatabaseDataType(database.escapeDataTypeName("nvarchar"), parameters);
            type.addAdditionalInformation(getAdditionalInformation());
            return type;
        }
        return super.toDatabaseDataType(database);*/
    }

    @Override
    public LoadDataChange.LOAD_DATA_TYPE getLoadTypeName() {
        return LoadDataChange.LOAD_DATA_TYPE.STRING;
    }

}
