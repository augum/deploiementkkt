package bdom.kikwit.web;

import bdom.kikwit.Dto.CategorieRequestDto;
import bdom.kikwit.Dto.CategorieResponseDto;
import bdom.kikwit.Services.CategorieService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping(path = "/api")
@CrossOrigin("*")
@Tag(name = "Categorie", description = "Gestion des categories des ESS")
public class CategorieController {
    CategorieService service;
  /*
  * Cette fonction sert à enregistrer des categories
  * */
    @PostMapping(path = "/categories")
    @Operation(summary = "Insertion de la categorie")
    public CategorieResponseDto save(@RequestBody CategorieRequestDto requestDto){
     return service.save(requestDto);
    }
    /*
    * Recuperation de la liste de toutes les categories
    * */
    @GetMapping(path = "/categories")
    @Operation(summary = "Lister toutes les categories")
    public List<CategorieResponseDto> list(){
        return service.getAll();
    }
    /*
    * Recupération d'une seule catégorie
    * */
    @GetMapping(path = "/categories/{id}")
    @Operation(summary = "Afficher une categorie")
    public CategorieResponseDto getOne(@PathVariable Long id){
        return service.getOne(id);
    }
    /*
    * Assure la modification d'une categorie
    * */
    @PutMapping(path = "/categories/{id}")
    @Operation(summary = "Modifier une categorie")
    public CategorieResponseDto update(@PathVariable Long id,@RequestBody CategorieRequestDto requestDto){
        return  service.update(id,requestDto);
    }
    @DeleteMapping(path = "/categories/{id}")
    @Operation(summary = "Supprimé une categorie")
    public String delete(@PathVariable Long id){
        return service.delete(id);
    }
}
