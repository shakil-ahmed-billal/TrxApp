import { Request, Response, NextFunction } from "express";
/**
 * Simple token-based authentication middleware
 * For internal use, we'll use a simple API token from environment variables
 */
export declare const authenticateToken: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.middleware.d.ts.map