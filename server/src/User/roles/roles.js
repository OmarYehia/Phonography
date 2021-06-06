const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function () {
  ac.grant("member")
  .readOwn("profile")
  .updateOwn("profile")
  .readOwn("post")
  .updateOwn("post");

  ac.grant("admin")
    .extend("member")
    .readAny("profile", ["*", "!password"])
    .deleteAny("profile")
    .updateAny("profile", ["role"])
    .updateAny("category")
    .updateAny("competition");

  return ac;
})();
