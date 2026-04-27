import {TestBase, TestDefinition} from "@test/suite";

class GenreTests extends TestBase {
    private async test1() {
        console.log(this);
    }

    public getTests(): TestDefinition[] {
        return [
            ["Test 1", this.test1]
        ];
    }

}

TestBase.register(GenreTests);