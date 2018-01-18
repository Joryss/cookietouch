import AccountConfiguration from "@/configurations/accounts/AccountConfiguration";
import { BlockSpectatorScenarios } from "@/extensions/fights/configuration/enums/BlockSpectatorScenarios";
import { FightSpeeds } from "@/extensions/fights/configuration/enums/FightSpeeds";
import { FightStartPlacement } from "@/extensions/fights/configuration/enums/FightStartPlacement";
import { FightTactics } from "@/extensions/fights/configuration/enums/FightTactics";
import { SpellResistances } from "@/extensions/fights/configuration/enums/SpellResistances";
import { SpellTargets } from "@/extensions/fights/configuration/enums/SpellTargets";
import Spell from "@/extensions/fights/configuration/Spell";
import FloodSentence from "@/extensions/flood/FloodSentence";
import { MapChangeDirections } from "@/game/managers/movements/MapChangeDirections";
import { MovementRequestResults } from "@/game/managers/movements/MovementRequestResults";
import { BreedEnum } from "@/protocol/enums/BreedEnum";
import { ChatActivableChannelsEnum } from "@/protocol/enums/ChatActivableChannelsEnum";
import Account from "@account";
import SpellToBoostEntry from "@account/configurations/SpellToBoostEntry";
import { BoostableStats } from "@game/character/BoostableStats";
import * as path from "path";
import * as React from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { Button } from "reactstrap";
import Console from "./Console";
import Infos from "./Infos";
import LeftMenu from "./LeftMenu";

interface IMainProps {
  //
}

interface IMainStates {
  //
}

export default class Main extends React.Component<IMainProps, IMainStates> {

  public account: Account;

  constructor(props: IMainProps) {
    super(props);

    const accountConfig = new AccountConfiguration("cookieproject1", "azerty123456", "Herdegrize", "Enoc");
    accountConfig.characterCreation.create = false;
    accountConfig.characterCreation.server = "Herdegrize";
    accountConfig.characterCreation.breed = BreedEnum.Iop;

    this.account = new Account(accountConfig);
    this.account.config.spellsToBoost.push(new SpellToBoostEntry(141, "Pression", 5));
    this.account.config.statToBoost = BoostableStats.STRENGTH;
    this.account.config.enableSpeedHack = true;

    const spell1 = new Spell(155, "Vitalité", SpellTargets.SELF, 2, 1, 100, 100, SpellResistances.EARTH, 100, 100, false, false, false, false);
    const spell2 = new Spell(158, "Concentration", SpellTargets.ENEMY, 1, 3, 100, 100, SpellResistances.EARTH, 100, 100, false, false, false, false);
    const spell3 = new Spell(141, "Pression", SpellTargets.ENEMY, 1, 2, 100, 100, SpellResistances.EARTH, 100, 100, false, false, false, false);
    const spell4 = new Spell(143, "Intimidation", SpellTargets.ENEMY, 1, 2, 100, 100, SpellResistances.NEUTRAL, 100, 100, false, false, false, false);

    this.account.extensions.fights.config.spells = [];
    this.account.extensions.fights.config.spells.push(spell1, spell2);

    this.account.extensions.fights.config.fightSpeed = FightSpeeds.SUICIDAL;
    this.account.extensions.fights.config.startPlacement = FightStartPlacement.CLOSE_TO_ENEMIES;
    this.account.extensions.fights.config.monsterToApproach = -1;
    this.account.extensions.fights.config.spellToApproach = -1;
    this.account.extensions.fights.config.blockSpectatorScenario = BlockSpectatorScenarios.NEVER;
    this.account.extensions.fights.config.lockFight = false;
    this.account.extensions.fights.config.tactic = FightTactics.AGGRESSIVE;
    this.account.extensions.fights.config.maxCells = 4;
    this.account.extensions.fights.config.approachWhenNoSpellCasted = true;
    this.account.extensions.fights.config.baseApproachAllMonsters = true;
    this.account.extensions.fights.config.regenStart = 80;
    this.account.extensions.fights.config.regenEnd = 100;
  }

  public componentDidMount() {
    this.account.scripts.ScriptLoaded.on((scriptName: string) => {
      this.account.scripts.startScript();
    });
  }

  public render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-4">
            <LeftMenu />
          </div>
          <div className="col">
            <Tabs>
              <TabList className="nav nav-tabs">
                <Tab className="nav-item">
                  <a className="nav-link active" href="#">Console</a>
                </Tab>
                <Tab className="nav-item">
                  <a className="nav-link" href="#">Test</a>
                </Tab>
              </TabList>

              <TabPanel>
                <h2>Console</h2>
              </TabPanel>
              <TabPanel>
                <Button color="primary" onClick={() => this.start()}>Start</Button>
                <Button color="primary" onClick={() => this.stop()}>Stop</Button>
                <hr />
                <Button color="warning" onClick={() => this.launchScript()}>Launch Script</Button>
                <Button color="danger" onClick={() => this.attack()}>Attack</Button>
                <Button color="info" onClick={() => this.flood()}>Flood</Button>
                <hr />
                <Button
                  color="secondary"
                  onClick={() => this.changeMap(MapChangeDirections.Top)}>Top</Button>
                <Button
                  color="secondary"
                  onClick={() => this.changeMap(MapChangeDirections.Bottom)}>Bottom</Button>
                <Button
                  color="secondary"
                  onClick={() => this.changeMap(MapChangeDirections.Left)}>Left</Button>
                <Button
                  color="secondary"
                  onClick={() => this.changeMap(MapChangeDirections.Right)}>Right</Button>
                <hr />
                <Infos account={this.account} />
                <Console account={this.account} />
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }

  private changeMap(dir: MapChangeDirections) {
    const res = this.account.game.managers.movements.changeMap(dir);
    this.account.logger.logDebug("", `Movement Result: ${res}`);
  }

  private launchScript() {
    this.account.scripts.fromFile(path.join(__dirname, "../../../resources/scripts/[Déplacement][Incarnam] Go Astrub!.js"));
  }

  private flood() {
    this.account.extensions.flood.config.generalChannelInterval = 30;
    this.account.extensions.flood.config.salesChannelInterval = 120;
    this.account.extensions.flood.config.seekChannelInterval = 60;
    this.account.extensions.flood.config.sentences.AddRange([
      new FloodSentence("Salut %name% tu es level %level% ?", null, true, false),
      new FloodSentence("Bonjour à tous les amis! %smiley%", ChatActivableChannelsEnum.CHANNEL_SEEK, false, false),
      new FloodSentence("Le nombre %nbr% est fascinant non?", ChatActivableChannelsEnum.CHANNEL_SALES, false, false),
    ]);
    this.account.extensions.flood.start();
  }

  private attack() {
    const group = this.account.game.map.getMonstersGroup()[0];
    if (!group) {
      return;
    }
    const movementResult = this.account.game.managers.movements.moveToCell(group.cellId);
    if (movementResult === MovementRequestResults.ALREADY_THERE || movementResult === MovementRequestResults.MOVED) {
      this.account.network.sendMessageFree("GameRolePlayAttackMonsterRequestMessage", {
        monsterGroupId: group.id,
      });
    }
  }

  private start() {
    this.account.start();
  }

  private stop() {
    this.account.stop();
  }
}
