{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.nodePackages.npm
    pkgs.git
    pkgs.coreutils
  ];
  env = {
    PATH = "${pkgs.nodejs-18_x}/bin:${pkgs.nodePackages.npm}/bin:$PATH";
  };
}
