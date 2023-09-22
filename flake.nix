{
  inputs = { nixpkgs.url = "github:nixos/nixpkgs/nixos-23.05"; };
  outputs = { self, nixpkgs, ... }:
    let
      supportedSystems = [ "aarch64-darwin" "aarch64-linux" "x86_64-darwin" "x86_64-linux" ];
      forAllSystems = nixpkgs.lib.genAttrs supportedSystems;
      nixpkgsFor = forAllSystems (system: import nixpkgs { inherit system; overlays = [ ]; });
    in
    {
      formatter = forAllSystems
        (system: nixpkgsFor.${system}.nixpkgs-fmt);

      devShells = forAllSystems
        (system: {
          default = let pkgs = nixpkgsFor.${system}; in
            pkgs.mkShell {
              buildInputs = with pkgs; [ nodejs_18 pre-commit ];
              # set environment variables
              shellHook = ''
                # install npm packages
                ${pkgs.nodejs_18}/bin/npm install

                # add node_modules/.bin to PATH
                export PATH=$PATH:$(pwd)/node_modules/.bin
              '';
            };
        });

      packages = forAllSystems
        (system: {
          default = let pkgs = nixpkgsFor.${system}; buildNpmPackage = pkgs.buildNpmPackage.override { nodejs = pkgs.nodejs_18; }; in
            buildNpmPackage {
              pname = "whisper-pwa";
              version = "0.0.0";
              src = self;
              npmDepsHash = "sha256-oRcTun5H1wphGcFMnc/WUEjucP+o0fl4JgWh5a4w6To=";
              preBuild = ''
                ${pkgs.jq}/bin/jq '.projects."whisper-pwa".architect.build.configurations.production.optimization.fonts = false' angular.json > angular-edit.json
                mv angular-edit.json angular.json
              '';
              installPhase = ''
                mkdir -p $out
                cp -r dist/whisper-pwa/* $out
              '';
            };
        });
    };

}
