package bdom.kikwit.web;

import bdom.kikwit.Dto.CartographieStructureRequestDto;
import bdom.kikwit.Dto.CartographieStructureResponseDto;
import bdom.kikwit.Services.CartographieStructureService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping(path = "/api")
@CrossOrigin("*")
@Tag(name = "CartographieStructure", description = "Cartographie des structures de santé")
public class CartographieStructureServiceController {
    private CartographieStructureService service;
    /*
    * Insertion d'une cartographie des structures
    * */
    @PostMapping(path = "/cartographies")
    @Operation(summary = "Enregistrement")
    public CartographieStructureResponseDto save(@RequestBody CartographieStructureRequestDto requestDto){
        return  service.save(requestDto);
    }
    /* Liste des cartographies*/
    @GetMapping(path = "/cartographies")
    @Operation(summary = "Liste des cartographies")
    public List<CartographieStructureResponseDto> getAll(){
        return service.liste();
    }
    /* Modifier une cartographie*/
    @PatchMapping(path = "/cartographies/{id}")
    @Operation(summary = "Modification d'une cartographie")
    public CartographieStructureResponseDto update(@PathVariable Long id,@RequestBody CartographieStructureRequestDto requestDto){
        return  service.update(id,requestDto);
    }
    /*
    obtenir une seule ligne de cartographie
    * */
    @GetMapping(path = "/cartographies/{id}")
    @Operation(summary = "Affiche une seule cartographie")
    public CartographieStructureResponseDto getOne(@PathVariable Long id){
        return  service.getOne(id);
    }

    @DeleteMapping(path = "/cartographies/{id}")
    @Operation(summary = "Suppression d'une cartographie")
    public String delete(@PathVariable Long id){
        return  service.delete(id);
    }
}
