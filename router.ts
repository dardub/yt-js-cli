export default class Router {
    private GetRoot;

    constructor() {
        this.GetRoot = new RouterNode({ path: "/" });
    }

    getRoot() {
        return this.GetRoot;
    }

    // Insert new GET Path handler
    Get(path: string, handler: Function): void {
        if (path === "/") {
            if (this.GetRoot.handler) {
                throw new Error("/ route already exists");
            }
            this.GetRoot.handler = handler;
        }
        // Remove leading and trailing slashes
        if (path[0] === "/") {
            path = path.slice(1);
        }
        if (path[path.length-1] === "/") {
            path = path.slice(0, -1);
        }
        
        let segments: string[] = path.split("/");
        segments.unshift("/");

        if (this.GetRoot === undefined) {
           this.GetRoot = new RouterNode({ path: segments[0], handler });
           segments.shift();
        }

        let curr = this.GetRoot;
        let parent = curr;

        while (segments.length) {
            const pathSegment = segments.shift()
            if (!curr || curr.path !== pathSegment) {
                // Only add handler if it's the end of the path
                if (segments.length) {
                    parent = parent.insert(pathSegment, undefined);
                    
                } else {
                    parent = parent.insert(pathSegment, handler);
                }
                curr = null;
            } else {
                parent = curr;
                curr = this.getChild(curr, segments[0]);
            }
        }
    }

    getChild(node: RouterNode, path: string): RouterNode|null {
        if (node.children?.length) {
            for (let i = 0; i < node.children.length; i++) {
                if (node.children[i].path === path) {
                    return node.children[i];
                }
            }
        }
        return null;
    }

    getMatch(path: string) {
        // Remove leading and trailing slashes
        path = this.trimSlashes(path);
        
        let segments: string[] = path.split("/");
        segments.unshift("/");


        
    }

    trimSlashes(path: string): string {
        if (path[0] === "/") {
            path = path.slice(1);
        }
        if (path[path.length-1] === "/") {
            path = path.slice(0, -1);
        }
        return path;
    }

}

class RouterNode {
    path: string;
    handler?: Function;
    children?: RouterNode[];

    constructor({ path, handler }: { path: string, handler?: Function}) {
        this.path = path;
        this.handler = handler;
    }

    insert(path: string, handler: Function): RouterNode {
        if (this.children === undefined) {
            this.children = [];
        }
        const node = new RouterNode({ path, handler });
        this.children.push(node);
        return node;
    }
}