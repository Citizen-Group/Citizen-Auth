const AccessControl = require("accesscontrol");

const ac = new AccessControl();

/**
 * Uses the accesscontrol (https://onury.io/accesscontrol/) package to simplify AC for this project
 */

exports.roles = (() => {
  ac.grant("basic").readOwn("profile").updateOwn("profile");

  ac.grant("mod").extend("basic").readAny("profile");

  ac.grant("admin")
    .extend("basic")
    .extend("mod")
    .updateAny("profile")
    .deleteAny("profile");

  return ac;
})();
