/*
 *  Copyright 2018 Willamette University
 *
 *  This file is part of OAI-PHM Service.
 *
 *  @author Michael Spalti
 *
 *  OAI-PHM Service is based on the Modular OAI-PMH Server, University of Helsinki,
 *  The National Library of Finland.
 *
 *  OAI-PHM Service is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  OAI-PHM Service is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with OAI-PHM Service.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as mysql from "mysql";
import { Pool } from "mysql";
import logger from "../../../server/logger";
import { getCredentials, hasCredentialsFile } from "../../core/credentials";

/**
 * This is the DAO service for Tagger. It uses a mysql connection
 * pool to retrieve data.  Database connection parameters are
 * provided by the credentials file (path defined in .env).
 */
export class MysqlConnector {
  private pool: Pool;
  public static instance: MysqlConnector;

  private constructor() {
    logger.debug("Setting up the Tagger mysql connection pool.");

    // Get path from the environment.
    const credFile = process.env.TAGGER_CONFIGURATION;

    if (hasCredentialsFile(credFile)) {
      const creds = getCredentials(credFile);

      logger.debug("host: " + creds.host);
      logger.debug("user: " + creds.user);
      logger.debug("password: " + creds.password);
      logger.debug("database: " + creds.database);

      this.pool = mysql.createPool({
        host: creds.host,
        user: creds.user,
        password: creds.password,
        database: creds.database
      });
    } else {
      logger.error(
        "The Tagger database connection could not be established. (If you do not need Tagger " +
          "you can disable the route.)"
      );
    }
  }

  public static getInstance(): MysqlConnector {
    try {
      if (this.instance) {
        return this.instance;
      }
      this.instance = new MysqlConnector();
      return this.instance;
    } catch (err) {
      throw new Error("Creating the backend module failed: " + err.message);
    }
  }

  /**
   * Responds to OAI ListRecords requests.
   * @param parameters
   * @returns {Promise<any>}
   */
  public recordsQuery(parameters: any): Promise<any> {
    let whereClause: string = "";
    if (parameters.from && parameters.until) {
      const until = this.pool.escape(parameters.until);
      const from = this.pool.escape(parameters.from);
      whereClause =
        " c.published = true AND c.updatedAt >= " +
        from +
        " AND c.updatedAt <= " +
        until;
    } else if (parameters.from) {
      const from = this.pool.escape(parameters.from);
      whereClause = " c.published = true AND c.updatedAt >= " + from;
    } else {
      whereClause = " c.published = true ";
    }

    logger.debug(whereClause);

    return new Promise((resolve: any, reject: any) => {
      this.pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }
        connection.query(
          "Select c.updatedAt, c.title, c.description, c.url, c.id, c.restricted, " +
            "cr.title AS category FROM Collections c JOIN CategoryTargets ct on ct.CollectionId=c.id " +
            "JOIN Categories cr on ct.CategoryId=cr.id WHERE " +
            whereClause,
          (err: Error, rows: any[]) => {
            if (err) {
              logger.debug(err);
              return reject(err);
            }
            resolve(rows);
            connection.release();
          }
        );
      });
    });
  }

  /**
   * Responds to OAI ListIdentifiers requests.
   * @param parameters
   * @returns {Promise<any>}
   */
  public identifiersQuery(parameters: any): Promise<any> {
    let query: string = "";
    if (parameters.from && parameters.until) {
      const until = this.pool.escape(parameters.until);
      const from = this.pool.escape(parameters.from);
      query =
        "Select id, updatedAt FROM Collections WHERE published = true AND updatedAt >= " +
        from +
        " AND updatedAt <= " +
        until;
    } else if (parameters.from) {
      const from = this.pool.escape(parameters.from);
      query =
        "Select id, updatedAt FROM Collections WHERE published = true AND updatedAt >= " +
        from;
    } else {
      query = "Select id, updatedAt FROM Collections WHERE published = true ";
    }
    logger.debug(query);

    return new Promise((resolve: any, reject: any) => {
      this.pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }
        connection.query(query, (err: Error, rows: any[]) => {
          if (err) {
            logger.debug(err);
            return reject(err);
          }
          resolve(rows);
          connection.release();
        });
      });
    });
  }

  /**
   * Responds to OAI GetRecord requests.
   * @param parameters
   * @returns {Promise<any>}
   */
  public getRecord(parameters: any): Promise<any> {
    logger.debug(parameters);

    return new Promise((resolve: any, reject: any) => {
      const query =
        "Select c.updatedAt, c.title, c.description, c.url, c.id, c.restricted, " +
        "cr.title AS category FROM Collections c JOIN CategoryTargets ct on ct.CollectionId=c.id " +
        "JOIN Categories cr on ct.CategoryId=cr.id WHERE c.id=" +
        this.pool.escape(parameters.identifier) +
        " AND c.published = true";

      logger.debug(query);

      this.pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }
        connection.query(query, (err: Error, rows: any[]) => {
          if (err) {
            logger.debug(err);
            return reject(err);
          }
          resolve(rows);
          connection.release();
        });
      });
    });
  }

  /**
   * Responds to OAI PutRecord requests.
   * @param parameters
   * @returns {Promise<any>}
   */
  public putRecord(parameters: any): Promise<any> {
    logger.debug(parameters);

    return new Promise((resolve: any, reject: any) => {
      const query = "";/*
        "Select c.updatedAt, c.title, c.description, c.url, c.id, c.restricted, " +
        "cr.title AS category FROM Collections c JOIN CategoryTargets ct on ct.CollectionId=c.id " +
        "JOIN Categories cr on ct.CategoryId=cr.id WHERE c.id=" +
        this.pool.escape(parameters.identifier) +
        " AND c.published = true";*/

      logger.debug(query);

      this.pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }
        connection.query(query, (err: Error, rows: any[]) => {
          if (err) {
            logger.debug(err);
            return reject(err);
          }
          resolve(rows);
          connection.release();
        });
      });
    });
  }
}
