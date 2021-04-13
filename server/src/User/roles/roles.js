const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function () {
  ac.grant("member").readOwn("profile").updateOwn("profile");

  ac.grant("admin")
    .extend("member")
    .readAny("profile", ["*", "!password"])
    .deleteAny("profile")
    .updateAny("staffMember");

  return ac;
})();
