/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/dbAccessor.ts":
/*!***************************!*\
  !*** ./src/dbAccessor.ts ***!
  \***************************/
/*! flagged exports */
/*! export DBAccessor [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DBAccessor = void 0;
const pg_1 = __webpack_require__(/*! pg */ "pg");
const uuid_1 = __webpack_require__(/*! uuid */ "uuid");
const pool = new pg_1.Pool({
    database: 'development',
    user: 'admin',
    password: 'password',
    host: '127.0.0.1',
    port: 5433
});
class DBAccessor {
    constructor() {
        this.get = async () => {
            const client = await pool.connect();
            try {
                const query = {
                    text: 'select * from public."TodoTasks"',
                };
                const result = await client.query(query);
                return result.rows;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
            finally {
                client.release();
            }
        };
        this.create = async (title) => {
            const client = await pool.connect();
            try {
                const query = {
                    text: 'insert into public."TodoTasks" (uuid, title, "createdAt", "updatedAt") VALUES ( $1, $2, current_timestamp, current_timestamp)',
                    values: [uuid_1.v4(), title]
                };
                await client.query(query);
            }
            catch (error) {
                console.error(error);
                throw error;
            }
            finally {
                client.release();
            }
        };
        this.update = async ({ uuid, title, status, }) => {
            const client = await pool.connect();
            try {
                const query = {
                    text: 'update public."TodoTasks" set title = $2, status=$3, updateAt=current_timestamp where uuid = $1',
                    values: [uuid, title, status]
                };
                await client.query(query);
            }
            catch (error) {
                console.error(error);
                throw error;
            }
            finally {
                client.release();
            }
        };
        this.delete = async ({ uuid }) => {
            const client = await pool.connect();
            try {
                const query = {
                    text: 'delte from public."TodoTasks" where uuid = $1',
                    values: [uuid]
                };
                await client.query(query);
            }
            catch (error) {
                console.error(error);
                throw error;
            }
            finally {
                client.release();
            }
        };
    }
}
exports.DBAccessor = DBAccessor;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:23-27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const express_1 = __importDefault(__webpack_require__(/*! express */ "express"));
const cors_1 = __importDefault(__webpack_require__(/*! cors */ "cors"));
const router_1 = __webpack_require__(/*! ./router */ "./src/router.ts");
const app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const port = 3000;
app.use('/', router_1.createRouter());
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});


/***/ }),

/***/ "./src/router.ts":
/*!***********************!*\
  !*** ./src/router.ts ***!
  \***********************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export createRouter [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createRouter = void 0;
const express_1 = __webpack_require__(/*! express */ "express");
const dbAccessor_1 = __webpack_require__(/*! ./dbAccessor */ "./src/dbAccessor.ts");
const dbAccessor = new dbAccessor_1.DBAccessor();
const createRouter = () => {
    const router = express_1.Router();
    router.get('/hello', (req, res) => {
        res.status(200).send({ messege: 'hello,hello!' });
    });
    router.get('/', async (req, res) => {
        try {
            const resBody = await dbAccessor.get();
            res.status(200).send({ messege: 'get succsess!', resBody });
        }
        catch (error) {
            console.error(error);
            res.status(400).send({ messege: 'get failed...' });
        }
    });
    router.put('/', async (req, res) => {
        try {
            if (!req.body.title) {
                res.status(400).send({ messege: 'title required' });
            }
            await dbAccessor.create(req.body.title);
            res.status(200).send({ messege: 'create succsess!' });
        }
        catch (error) {
            console.error(error);
            res.status(400).send({ messege: 'create failed...' });
        }
    });
    router.post('/:taskID', async (req, res) => {
        try {
            if (!req.body) {
                res.status(400).send({ messege: 'body required' });
            }
            await dbAccessor.update({ uuid: req.params.taskID, ...req.body });
            res.status(200).send({ messege: 'update succsess!' });
        }
        catch (error) {
            console.error(error);
            res.status(400).send({ messege: 'update failed...' });
        }
    });
    router.delete('/:taskID', async (req, res) => {
        try {
            if (!req.body) {
                res.status(400).send({ messege: 'body required' });
            }
            await dbAccessor.delete({ uuid: req.params.taskID });
            res.status(200).send({ messege: 'delete succsess!' });
        }
        catch (error) {
            console.error(error);
            res.status(400).send({ messege: 'delete failed...' });
        }
    });
    return router;
};
exports.createRouter = createRouter;


/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! dynamic exports */
/*! exports [maybe provided (runtime-defined)] [no usage info] */
/*! runtime requirements: module */
/***/ ((module) => {

module.exports = require("cors");;

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! dynamic exports */
/*! exports [maybe provided (runtime-defined)] [no usage info] */
/*! runtime requirements: module */
/***/ ((module) => {

module.exports = require("express");;

/***/ }),

/***/ "pg":
/*!*********************!*\
  !*** external "pg" ***!
  \*********************/
/*! dynamic exports */
/*! exports [maybe provided (runtime-defined)] [no usage info] */
/*! runtime requirements: module */
/***/ ((module) => {

module.exports = require("pg");;

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/*! dynamic exports */
/*! exports [maybe provided (runtime-defined)] [no usage info] */
/*! runtime requirements: module */
/***/ ((module) => {

module.exports = require("uuid");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	__webpack_require__("./src/index.ts");
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zZXJ2ZXIvLi9zcmMvZGJBY2Nlc3Nvci50cyIsIndlYnBhY2s6Ly9zZXJ2ZXIvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vc2VydmVyLy4vc3JjL3JvdXRlci50cyIsIndlYnBhY2s6Ly9zZXJ2ZXIvZXh0ZXJuYWwgXCJjb3JzXCIiLCJ3ZWJwYWNrOi8vc2VydmVyL2V4dGVybmFsIFwiZXhwcmVzc1wiIiwid2VicGFjazovL3NlcnZlci9leHRlcm5hbCBcInBnXCIiLCJ3ZWJwYWNrOi8vc2VydmVyL2V4dGVybmFsIFwidXVpZFwiIiwid2VicGFjazovL3NlcnZlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9zZXJ2ZXIvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlEQUEwQjtBQUMxQix1REFBb0M7QUFHcEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxTQUFJLENBQUM7SUFDbEIsUUFBUSxFQUFFLGFBQWE7SUFDdkIsSUFBSSxFQUFFLE9BQU87SUFDYixRQUFRLEVBQUUsVUFBVTtJQUNwQixJQUFJLEVBQUUsV0FBVztJQUNqQixJQUFJLEVBQUUsSUFBSTtDQUNiLENBQUMsQ0FBQztBQU1ILE1BQWEsVUFBVTtJQUF2QjtRQU1XLFFBQUcsR0FBRyxLQUFLLElBQUksRUFBRTtZQUVwQixNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUVwQyxJQUFJO2dCQUVBLE1BQU0sS0FBSyxHQUFHO29CQUNWLElBQUksRUFBRSxrQ0FBa0M7aUJBQzNDLENBQUM7Z0JBR0YsTUFBTSxNQUFNLEdBQUcsTUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUV6QyxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUM7YUFDdEI7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDWixPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxD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LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUG9vbCB9IGZyb20gXCJwZ1wiO1xyXG5pbXBvcnQgeyB2NCBhcyB1dWlkdjQgfSBmcm9tIFwidXVpZFwiO1xyXG5cclxuLy/mjqXntprmg4XloLFcclxuY29uc3QgcG9vbCA9IG5ldyBQb29sKHtcclxuICAgIGRhdGFiYXNlOiAnZGV2ZWxvcG1lbnQnLFxyXG4gICAgdXNlcjogJ2FkbWluJyxcclxuICAgIHBhc3N3b3JkOiAncGFzc3dvcmQnLFxyXG4gICAgaG9zdDogJzEyNy4wLjAuMScsXHJcbiAgICBwb3J0OiA1NDMzXHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIERC5o6l57aa44Kv44Op44K5XHJcbiAqIFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIERCQWNjZXNzb3Ige1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44K/44K544Kv5LiA6Kan5oOF5aCx5Y+W5b6XXHJcbiAgICAgKiBAcmV0dXJucyB7IGFueSB9IHJlc3VsdFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0ID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIC8v5o6l57aaXHJcbiAgICAgICAgY29uc3QgY2xpZW50ID0gYXdhaXQgcG9vbC5jb25uZWN0KCk7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIC8v5a6f6KGMU1FMXHJcbiAgICAgICAgICAgIGNvbnN0IHF1ZXJ5ID0ge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogJ3NlbGVjdCAqIGZyb20gcHVibGljLlwiVG9kb1Rhc2tzXCInLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy9zcWzmipXjgZLjgotcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgY2xpZW50LnF1ZXJ5KHF1ZXJ5KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQucm93cztcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICAgICAgLy/mjqXntprntYLkuoZcclxuICAgICAgICAgICAgY2xpZW50LnJlbGVhc2UoKVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB0aXRsZSBcclxuICAgICAqLyBcclxuICAgIHB1YmxpYyBjcmVhdGUgPSBhc3luYyAodGl0bGU6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIC8v5o6l57aaXHJcbiAgICAgICAgY29uc3QgY2xpZW50ID0gYXdhaXQgcG9vbC5jb25uZWN0KCk7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIC8v5a6f6KGMU1FMXHJcbiAgICAgICAgICAgIGNvbnN0IHF1ZXJ5ID0ge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogJ2luc2VydCBpbnRvIHB1YmxpYy5cIlRvZG9UYXNrc1wiICh1dWlkLCB0aXRsZSwgXCJjcmVhdGVkQXRcIiwgXCJ1cGRhdGVkQXRcIikgVkFMVUVTICggJDEsICQyLCBjdXJyZW50X3RpbWVzdGFtcCwgY3VycmVudF90aW1lc3RhbXApJyxcclxuICAgICAgICAgICAgICAgIHZhbHVlczogW3V1aWR2NCgpLCB0aXRsZV1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vc3Fs5oqV44GS44KLXHJcbiAgICAgICAgICAgIGF3YWl0IGNsaWVudC5xdWVyeShxdWVyeSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcclxuICAgICAgICB9IGZpbmFsbHkge1xyXG4gICAgICAgICAgICAvL+aOpee2mue1guS6hlxyXG4gICAgICAgICAgICBjbGllbnQucmVsZWFzZSgpXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOabtOaWsFxyXG4gICAgICogXHJcbiAgICAgKiBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHVwZGF0ZSA9IGFzeW5jICh7XHJcbiAgICAgICAgdXVpZCxcclxuICAgICAgICB0aXRsZSxcclxuICAgICAgICBzdGF0dXMsXHJcbiAgICB9OiB7XHJcbiAgICAgICAgdXVpZDogc3RyaW5nO1xyXG4gICAgICAgIHRpdGxlOiBzdHJpbmc7XHJcbiAgICAgICAgc3RhdHVzOiBzdHJpbmc7XHJcbiAgICB9KSA9PiB7XHJcblxyXG4gICAgICAgIC8v5o6l57aaXHJcbiAgICAgICAgY29uc3QgY2xpZW50ID0gYXdhaXQgcG9vbC5jb25uZWN0KCk7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIC8v5a6f6KGMU1FMXHJcbiAgICAgICAgICAgIGNvbnN0IHF1ZXJ5ID0ge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogJ3VwZGF0ZSBwdWJsaWMuXCJUb2RvVGFza3NcIiBzZXQgdGl0bGUgPSAkMiwgc3RhdHVzPSQzLCB1cGRhdGVBdD1jdXJyZW50X3RpbWVzdGFtcCB3aGVyZSB1dWlkID0gJDEnLFxyXG4gICAgICAgICAgICAgICAgdmFsdWVzOiBbdXVpZCwgdGl0bGUsIHN0YXR1c11cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vc3Fs5oqV44GS44KLXHJcbiAgICAgICAgICAgIGF3YWl0IGNsaWVudC5xdWVyeShxdWVyeSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcclxuICAgICAgICB9IGZpbmFsbHkge1xyXG4gICAgICAgICAgICAvL+aOpee2mue1guS6hlxyXG4gICAgICAgICAgICBjbGllbnQucmVsZWFzZSgpXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgZGVsZXRlID0gYXN5bmMgKCB7IHV1aWQgfSA6IHt1dWlkOiBzdHJpbmd9ICkgPT4ge1xyXG5cclxuICAgICAgICAvL+aOpee2mlxyXG4gICAgICAgIGNvbnN0IGNsaWVudCA9IGF3YWl0IHBvb2wuY29ubmVjdCgpO1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAvL+Wun+ihjFNRTFxyXG4gICAgICAgICAgICBjb25zdCBxdWVyeSA9IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6ICdkZWx0ZSBmcm9tIHB1YmxpYy5cIlRvZG9UYXNrc1wiIHdoZXJlIHV1aWQgPSAkMScsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZXM6IFt1dWlkXVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy9zcWzmipXjgZLjgotcclxuICAgICAgICAgICAgYXdhaXQgY2xpZW50LnF1ZXJ5KHF1ZXJ5KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xyXG4gICAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgICAgIC8v5o6l57aa57WC5LqGXHJcbiAgICAgICAgICAgIGNsaWVudC5yZWxlYXNlKClcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxufSIsImltcG9ydCBleHByZXNzIGZyb20gXCJleHByZXNzXCI7XHJcbmltcG9ydCBjb3JzIGZyb20gXCJjb3JzXCI7XHJcbmltcG9ydCB7IGNyZWF0ZVJvdXRlciB9IGZyb20gXCIuL3JvdXRlclwiO1xyXG5cclxuXHJcbmNvbnN0IGFwcCA9IGV4cHJlc3MoKTtcclxuYXBwLnVzZShjb3JzKCkpO1xyXG5hcHAudXNlKGV4cHJlc3MuanNvbigpKTtcclxuYXBwLnVzZShleHByZXNzLnVybGVuY29kZWQoeyBleHRlbmRlZDogdHJ1ZSB9KSk7XHJcblxyXG5jb25zdCBwb3J0ID0gMzAwMDtcclxuXHJcbmFwcC51c2UoJy8nLCBjcmVhdGVSb3V0ZXIoKSk7XHJcblxyXG5cclxuYXBwLmxpc3Rlbihwb3J0LCAoKT0+e1xyXG4gICAgY29uc29sZS5sb2coIGBMaXN0ZW5pbmcgYXQgaHR0cDovL2xvY2FsaG9zdDoke3BvcnR9L2AgKVxyXG59KTsiLCJpbXBvcnQgeyBSb3V0ZXIgfSBmcm9tIFwiZXhwcmVzc1wiO1xyXG5pbXBvcnQgeyBEQkFjY2Vzc29yIH0gZnJvbSBcIi4vZGJBY2Nlc3NvclwiO1xyXG5cclxuXHJcbmNvbnN0IGRiQWNjZXNzb3IgPSBuZXcgREJBY2Nlc3NvcigpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGNyZWF0ZVJvdXRlciA9ICgpID0+IHtcclxuXHJcbiAgICBjb25zdCByb3V0ZXIgPSBSb3V0ZXIoKTtcclxuXHJcbiAgICByb3V0ZXIuZ2V0KCcvaGVsbG8nLCAocmVxLCByZXMpID0+IHtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IG1lc3NlZ2U6ICdoZWxsbyxoZWxsbyEnIH0pXHJcbiAgICB9KTtcclxuXHJcbiAgICAvL3JlYWRcclxuICAgIHJvdXRlci5nZXQoJy8nLCBhc3luYyhyZXEsIHJlcykgPT4ge1xyXG4gICAgXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzQm9keSA9IGF3YWl0IGRiQWNjZXNzb3IuZ2V0KCk7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHsgbWVzc2VnZTogJ2dldCBzdWNjc2VzcyEnLCByZXNCb2R5IH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwMCkuc2VuZCh7IG1lc3NlZ2U6ICdnZXQgZmFpbGVkLi4uJyB9KVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vY3JlYXRlXHJcbiAgICByb3V0ZXIucHV0KCcvJywgYXN5bmMocmVxLCByZXMpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAoIXJlcS5ib2R5LnRpdGxlKSB7XHJcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDQwMCkuc2VuZCh7IG1lc3NlZ2U6ICd0aXRsZSByZXF1aXJlZCcgfSkgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYXdhaXQgZGJBY2Nlc3Nvci5jcmVhdGUocmVxLmJvZHkudGl0bGUpO1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IG1lc3NlZ2U6ICdjcmVhdGUgc3VjY3Nlc3MhJyB9KVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwMCkuc2VuZCh7IG1lc3NlZ2U6ICdjcmVhdGUgZmFpbGVkLi4uJyB9KVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vdXBkYXRlXHJcbiAgICByb3V0ZXIucG9zdCgnLzp0YXNrSUQnLCBhc3luYyhyZXEsIHJlcykgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmICghcmVxLmJvZHkpIHtcclxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHsgbWVzc2VnZTogJ2JvZHkgcmVxdWlyZWQnIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGF3YWl0IGRiQWNjZXNzb3IudXBkYXRlKHt1dWlkOiByZXEucGFyYW1zLnRhc2tJRCwgLi4ucmVxLmJvZHl9KTtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoeyBtZXNzZWdlOiAndXBkYXRlIHN1Y2NzZXNzIScgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHsgbWVzc2VnZTogJ3VwZGF0ZSBmYWlsZWQuLi4nIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy9kZWxldGVcclxuICAgIHJvdXRlci5kZWxldGUoJy86dGFza0lEJywgYXN5bmMocmVxLCByZXMpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAoIXJlcS5ib2R5KSB7XHJcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDQwMCkuc2VuZCh7IG1lc3NlZ2U6ICdib2R5IHJlcXVpcmVkJyB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBhd2FpdCBkYkFjY2Vzc29yLmRlbGV0ZSh7dXVpZDogcmVxLnBhcmFtcy50YXNrSUR9KTtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoeyBtZXNzZWdlOiAnZGVsZXRlIHN1Y2NzZXNzIScgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHsgbWVzc2VnZTogJ2RlbGV0ZSBmYWlsZWQuLi4nIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIHJldHVybiByb3V0ZXI7XHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29yc1wiKTs7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTs7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGdcIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInV1aWRcIik7OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGVcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iXSwic291cmNlUm9vdCI6IiJ9